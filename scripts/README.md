# 豆瓣同步脚本

把豆瓣"看过的电影 / 读过的书"同步到博客的 `娱乐` 板块。

## 第一次使用

```bash
cd scripts
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 准备 Cookie（必需）

1. 用浏览器登录 <https://www.douban.com>
2. 打开 DevTools（F12）→ Network 面板
3. 刷新一下首页，点列表里任意 `douban.com` 的请求
4. 右侧 Headers → Request Headers → 找到 `Cookie:` 这一整行
5. **只复制冒号后面的值**，粘贴到 `scripts/cookie.txt`（一行，不要换行）

`cookie.txt` 已经在 `.gitignore` 里，不会被提交。

## 跑

```bash
# 抓全部（电影 + 图书）
python douban_sync.py

# 只抓电影
python douban_sync.py movie

# 只抓图书
python douban_sync.py book
```

输出文件：

- `src/data/douban/movies.json`
- `src/data/douban/books.json`

确认数据无误后再 `git add` / `git commit` / `git push`。

## 可能的问题

- **被重定向到登录页**：Cookie 失效，重新复制
- **抓到空列表**：豆瓣 DOM 结构变了，需要更新 `parse_movie_item` / `parse_book_item`
- **海报加载不出来**：博客模板里 `<img>` 已经加了 `referrerpolicy="no-referrer"`，
  如果还有问题，可能是豆瓣图片 CDN 临时抽风
