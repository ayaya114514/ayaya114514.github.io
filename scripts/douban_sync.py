#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
豆瓣"看过的电影 / 读过的书"抓取脚本
====================================

用途：
    1. 用你登录后的 Cookie 访问豆瓣个人页
    2. 翻完所有"看过 / 读过"页面
    3. 把每条记录（标题、海报、个人评分、标记日期、短评、链接）
       保存为 JSON，供 Astro 博客读取

为什么需要 Cookie？
    豆瓣对未登录用户限制很严：未登录访问 /people/{id}/collect
    经常被重定向到登录页，或者只能看到很少的几页。登录后没问题。

使用方法：
    1. cd scripts
    2. python -m venv .venv && source .venv/bin/activate
    3. pip install -r requirements.txt
    4. 把豆瓣 Cookie 放到 scripts/cookie.txt（详见 README 注释）
    5. python douban_sync.py
       脚本会输出到 ../src/data/douban/movies.json 和 books.json
"""

import json
import os
import random
import re
import sys
import time
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

# ---------- 配置 ----------

# 你的豆瓣用户 ID（从 profile URL 取，如 https://www.douban.com/people/290893353/）
USER_ID = "290893353"

# Cookie 文件路径。把整段 Cookie（一行）放进去
# 怎么拿 Cookie：浏览器登录豆瓣后 → F12 → Network → 选任意 douban.com 请求
#               → Headers → Request Headers → 复制 Cookie 整行
COOKIE_FILE = Path(__file__).parent / "cookie.txt"

# 输出目录（相对脚本所在目录）
OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data" / "douban"

# 封面图存放目录（public/ 下的会被 Astro 直接当静态资源 serve）
COVER_DIR = Path(__file__).parent.parent / "public" / "images" / "douban"

# 在网页里引用图片时的前缀（对应 COVER_DIR 在站点根的位置）
COVER_URL_PREFIX = "/images/douban"

# 每页 15 条；豆瓣稳定的分页大小
PAGE_SIZE = 15

# 每次请求之间的最小/最大睡眠秒数，防止被风控
SLEEP_MIN = 2.0
SLEEP_MAX = 4.5

# 请求超时
TIMEOUT = 20

HEADERS_BASE = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
}


# ---------- 工具函数 ----------


def load_cookie() -> str:
    """读 cookie.txt。文件不存在或为空时直接退出，避免发出无效请求。"""
    if not COOKIE_FILE.exists():
        sys.exit(
            f"[!] 找不到 cookie 文件：{COOKIE_FILE}\n"
            "    请先把浏览器里登录豆瓣后的 Cookie 整行复制到这个文件。"
        )
    cookie = COOKIE_FILE.read_text(encoding="utf-8").strip()
    if not cookie:
        sys.exit(f"[!] {COOKIE_FILE} 为空，请粘贴 Cookie 后重试")
    return cookie


def make_session(cookie: str) -> requests.Session:
    """构建一个带 Cookie 和 UA 的 session，便于复用连接。"""
    sess = requests.Session()
    sess.headers.update(HEADERS_BASE)
    sess.headers["Cookie"] = cookie
    return sess


def polite_sleep() -> None:
    """随机睡眠，模拟人为浏览节奏。"""
    time.sleep(random.uniform(SLEEP_MIN, SLEEP_MAX))


def parse_rating(li_block) -> int | None:
    """
    解析星级。豆瓣的星级写在 <span class="rating{N}-t"></span>，N 取 1-5。
    没评分返回 None。
    """
    span = li_block.find("span", class_=re.compile(r"^rating[1-5]-t$"))
    if not span:
        return None
    m = re.search(r"rating([1-5])-t", " ".join(span.get("class", [])))
    return int(m.group(1)) if m else None


def parse_date(li_block) -> str | None:
    """标记日期通常在 <span class="date">2024-01-15</span>。"""
    date_span = li_block.find("span", class_="date")
    return date_span.get_text(strip=True) if date_span else None


def parse_comment(li_block) -> str | None:
    """短评在 <span class="comment">...</span>，没写就没有。"""
    c = li_block.find("span", class_="comment")
    if not c:
        return None
    text = c.get_text(strip=True)
    return text or None


def upgrade_cover(url: str) -> str:
    """
    豆瓣海报有不同清晰度版本：
        s_ratio_poster (小)、m_ratio_poster (中)、l_ratio_poster (大)
        以及 /spst/ /lpst/ /mpst/
    把 small / spst 换成 medium / mpst，画质好但仍然不大。
    """
    if not url:
        return url
    url = url.replace("/s_ratio_poster/", "/m_ratio_poster/")
    url = url.replace("/spst/", "/mpst/")
    url = url.replace("/subject/s/", "/subject/m/")
    # 书的封面
    url = url.replace("/s/public/", "/m/public/")
    return url


def download_cover(url: str, sess: requests.Session) -> str | None:
    """
    把豆瓣封面图下载到 public/images/douban/，返回站点内的相对路径。

    为什么不直接在前端引用豆瓣 URL？
        豆瓣图片 CDN 检查 referer，从我们站点直接 <img src="..."> 会被
        403 拒绝。`referrerpolicy="no-referrer"` 在国内浏览器表现不一致；
        `wsrv.nl` 之类的代理在国内也常常被墙。最稳的是脚本下载到本地，
        让 GitHub Pages 当普通静态资源 serve。

    返回 None 表示下载失败（保留原 URL 让前端兜底）。
    """
    if not url:
        return None
    COVER_DIR.mkdir(parents=True, exist_ok=True)

    # 豆瓣图片 URL 末尾就是文件名，比如 .../public/p2928772586.webp
    filename = url.rstrip("/").split("/")[-1] or "unknown"
    # 防止极端情况里出现奇怪字符
    filename = re.sub(r"[^\w.\-]", "_", filename)
    local_path = COVER_DIR / filename

    if local_path.exists() and local_path.stat().st_size > 0:
        # 已经下过就跳过，方便增量更新
        return f"{COVER_URL_PREFIX}/{filename}"

    # 下豆瓣的图必须带 referer，否则也是 403
    headers = {
        "User-Agent": HEADERS_BASE["User-Agent"],
        "Referer": "https://movie.douban.com/",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    }
    try:
        # 注意：用全新的 requests 调用，不用 session 上的 cookie
        # （豆瓣图床域名 doubanio.com 不需要 cookie，反而带上更可疑）
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code != 200 or not r.content:
            print(f"    [封面下载失败] HTTP {r.status_code}  {url}")
            return None
        local_path.write_bytes(r.content)
        return f"{COVER_URL_PREFIX}/{filename}"
    except Exception as e:
        print(f"    [封面下载异常] {e}  {url}")
        return None


def fetch_page(sess: requests.Session, url: str) -> tuple[BeautifulSoup, str]:
    """请求一页 HTML，做基础错误检查后返回解析好的 soup 和原始 HTML 文本。"""
    resp = sess.get(url, timeout=TIMEOUT, allow_redirects=True)
    # 被重定向到登录页 = Cookie 失效
    if "accounts.douban.com" in resp.url or resp.status_code in (302, 403):
        sys.exit(
            f"[!] 被重定向/拒绝（status={resp.status_code}, final={resp.url}）\n"
            "    很可能是 Cookie 过期或失效，请重新复制后再跑。"
        )
    if resp.status_code != 200:
        sys.exit(f"[!] HTTP {resp.status_code}：{url}")
    return BeautifulSoup(resp.text, "html.parser"), resp.text


def dump_debug(html: str, tag: str) -> Path:
    """抓不到内容时把 HTML 落盘，方便人工看 DOM 结构。"""
    debug_dir = Path(__file__).parent / "debug"
    debug_dir.mkdir(exist_ok=True)
    path = debug_dir / f"{tag}-{int(time.time())}.html"
    path.write_text(html, encoding="utf-8")
    return path


# ---------- 电影抓取 ----------


def parse_movie_item(li) -> dict[str, Any] | None:
    """从 <div class="item"> 里抽取电影信息。"""
    pic_a = li.select_one("div.pic a")
    info = li.select_one("div.info")
    if not pic_a or not info:
        return None

    img = pic_a.find("img")
    cover = upgrade_cover(img["src"]) if img and img.get("src") else None

    title_em = info.select_one("li.title em")
    # 标题里有时是 "中文名 / 原名"，统一只取斜杠前部分
    raw_title = title_em.get_text(strip=True) if title_em else ""
    title = raw_title.split(" / ")[0].strip()
    original_title = raw_title if " / " in raw_title else None

    intro = info.select_one("li.intro")
    intro_text = intro.get_text(" ", strip=True) if intro else None

    return {
        "title": title,
        "original_title": original_title,
        "intro": intro_text,
        "url": pic_a.get("href"),
        "cover": cover,
        "rating": parse_rating(info),
        "date": parse_date(info),
        "comment": parse_comment(info),
    }


def fetch_movies(sess: requests.Session) -> list[dict[str, Any]]:
    """翻完整个 movie /people/{id}/collect 列表。"""
    items: list[dict[str, Any]] = []
    start = 0
    page_no = 1
    while True:
        url = (
            f"https://movie.douban.com/people/{USER_ID}/collect"
            f"?start={start}&sort=time&rating=all&filter=all&mode=grid"
        )
        print(f"[movie] page {page_no}  ->  {url}")
        soup, html = fetch_page(sess, url)
        page_items = soup.select("div.grid-view div.item")
        if not page_items:
            if page_no == 1:
                p = dump_debug(html, "movies-page1-empty")
                print(f"[!] 第一页没解析到任何条目，HTML 已存到 {p}")
            break
        for li in page_items:
            row = parse_movie_item(li)
            if row:
                items.append(row)
        # 没有"后页 >"链接就停
        next_link = soup.select_one("span.next a")
        if not next_link:
            break
        start += PAGE_SIZE
        page_no += 1
        polite_sleep()
    return items


# ---------- 图书抓取 ----------


def parse_book_item_grid(item) -> dict[str, Any] | None:
    """grid 模式下，书和电影 DOM 几乎一样：div.item > div.pic + div.info。"""
    pic_a = item.select_one("div.pic a")
    info = item.select_one("div.info")
    if not pic_a or not info:
        return None
    img = pic_a.find("img")
    cover = upgrade_cover(img["src"]) if img and img.get("src") else None
    title_em = info.select_one("li.title em") or info.select_one("li.title a")
    raw_title = title_em.get_text(strip=True) if title_em else ""
    intro = info.select_one("li.intro")
    return {
        "title": raw_title,
        "intro": intro.get_text(" ", strip=True) if intro else None,
        "url": pic_a.get("href"),
        "cover": cover,
        "rating": parse_rating(info),
        "date": parse_date(info),
        "comment": parse_comment(info),
    }


def parse_book_item_list(li) -> dict[str, Any] | None:
    """list 模式（豆瓣图书的默认视图）：
    li.subject-item > div.pic + div.info，info 内是 h2/div.pub/div.short-note。
    """
    pic_a = li.select_one("a.nbg") or li.select_one("div.pic a")
    info = li.select_one("div.info")
    if not pic_a or not info:
        return None

    img = pic_a.find("img")
    cover = upgrade_cover(img["src"]) if img and img.get("src") else None

    # 标题：list 模式下在 <h2><a>书名</a></h2>
    title_a = info.select_one("h2 a")
    title = (
        title_a.get_text(" ", strip=True).replace("\n", " ").strip()
        if title_a
        else (img.get("alt") if img else "").strip()
    )

    pub = info.select_one("div.pub")
    pub_text = pub.get_text(" ", strip=True) if pub else None

    # 评分和日期通常在 div.short-note 里
    note = info.select_one("div.short-note") or info
    return {
        "title": title,
        "intro": pub_text,
        "url": pic_a.get("href"),
        "cover": cover,
        "rating": parse_rating(note),
        "date": parse_date(note),
        "comment": parse_comment(note) or _list_mode_comment(info),
    }


def _list_mode_comment(info) -> str | None:
    """list 模式短评在 <p class="comment">，和 grid 模式不一样，单独取一下。"""
    p = info.select_one("p.comment")
    if not p:
        return None
    text = p.get_text(strip=True)
    return text or None


def fetch_books(sess: requests.Session) -> list[dict[str, Any]]:
    """翻完 book /people/{id}/collect 列表。同时兼容 grid / list 两种结构。"""
    items: list[dict[str, Any]] = []
    start = 0
    page_no = 1
    # 注意：豆瓣图书页对 mode=grid 不一定生效，所以两种结构都要 parse
    while True:
        url = (
            f"https://book.douban.com/people/{USER_ID}/collect"
            f"?start={start}&sort=time&rating=all&filter=all&mode=grid"
        )
        print(f"[book]  page {page_no}  ->  {url}")
        soup, html = fetch_page(sess, url)

        # 先看是不是 grid 视图
        grid_items = soup.select("div.grid-view div.item")
        list_items = soup.select("ul.list-view li.subject-item") + soup.select(
            "li.subject-item"
        )

        if grid_items:
            page_items = [parse_book_item_grid(it) for it in grid_items]
        elif list_items:
            page_items = [parse_book_item_list(it) for it in list_items]
        else:
            page_items = []

        page_items = [x for x in page_items if x]

        if not page_items:
            if page_no == 1:
                p = dump_debug(html, "books-page1-empty")
                print(
                    f"[!] 图书第一页没解析到条目，HTML 已存到 {p}\n"
                    "    可能：(a) 你确实没标记过任何'读过'的书；"
                    "(b) 豆瓣 DOM 又变了，把这个 HTML 发过来我调整 parser"
                )
            break

        items.extend(page_items)
        next_link = soup.select_one("span.next a")
        if not next_link:
            break
        start += PAGE_SIZE
        page_no += 1
        polite_sleep()
    return items


# ---------- 写出 ----------


def localize_covers(
    items: list[dict[str, Any]], sess: requests.Session, label: str
) -> None:
    """
    遍历抓到的条目，把 cover 字段从豆瓣 URL 替换为本地相对路径。
    下载失败就把 cover 置 None，前端会显示"无封面"占位。

    为了不把豆瓣图床打挂，每张图之间睡 0.3-0.8 秒。
    """
    total = len(items)
    for i, it in enumerate(items, 1):
        remote = it.get("cover")
        if not remote or remote.startswith(COVER_URL_PREFIX):
            continue
        local = download_cover(remote, sess)
        it["cover"] = local  # 失败就是 None
        # 简单进度提示，每 10 张打一次
        if i % 10 == 0 or i == total:
            print(f"    [{label}] 封面下载进度 {i}/{total}")
        time.sleep(random.uniform(0.3, 0.8))


def dump_json(items: list[dict[str, Any]], path: Path) -> None:
    """把数据写成漂亮缩进的 JSON，方便 git diff 看变化。"""
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "user_id": USER_ID,
        "count": len(items),
        "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "items": items,
    }
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"  -> 已写入 {path}（{len(items)} 条）")


# ---------- 主流程 ----------


def main() -> None:
    cookie = load_cookie()
    sess = make_session(cookie)

    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    if target in ("all", "movie", "movies"):
        print("=== 抓取电影 ===")
        movies = fetch_movies(sess)
        print(f"=== 下载电影封面（共 {len(movies)} 张） ===")
        localize_covers(movies, sess, "movie")
        dump_json(movies, OUTPUT_DIR / "movies.json")
        polite_sleep()

    if target in ("all", "book", "books"):
        print("=== 抓取图书 ===")
        books = fetch_books(sess)
        print(f"=== 下载图书封面（共 {len(books)} 张） ===")
        localize_covers(books, sess, "book")
        dump_json(books, OUTPUT_DIR / "books.json")

    print("\n完成。检查 src/data/douban/ 下的 JSON，确认无误后再 git commit。")


if __name__ == "__main__":
    main()
