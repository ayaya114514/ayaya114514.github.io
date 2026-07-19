# 娱乐数据同步脚本

## YouTube 订阅

`youtube_sync.mjs` 通过 YouTube Data API v3 读取当前授权账号的订阅频道，
并更新 `src/data/youtube-subs.json` 和缺失的频道头像。旧的
`import_youtube_subs.mjs` 仍可用于导入 Google Takeout CSV。

### 第一次使用

1. 在 Google Cloud Console 启用 **YouTube Data API v3**。
2. 创建 Desktop app 类型的 OAuth client。
3. 把包含 `client_id` 和 `client_secret` 的 client JSON 保存到下列路径：

   ```text
   ~/Library/Application Support/ayaya-blog/youtube-client.json
   ```

4. 运行同步，浏览器会打开一次 Google 授权页。脚本固定只申请
   `youtube.readonly`：

   ```bash
   npm run sync:youtube
   ```

OAuth token 默认保存在同目录的 `youtube-token.json`，不会写入 repo。
如果授权失效，可重新授权：

```bash
npm run sync:youtube -- --reauthorize
```

其它选项：

```bash
npm run sync:youtube -- --auth-only
npm run sync:youtube -- --refresh-avatars
```

环境变量 `YOUTUBE_SYNC_CONFIG_DIR`、`YOUTUBE_OAUTH_CLIENT` 和
`YOUTUBE_OAUTH_TOKEN` 可以覆盖默认凭据路径。

## 豆瓣

把豆瓣"看过的电影 / 读过的书"同步到博客的 `娱乐` 板块。

### 第一次使用

```bash
python3 -m venv scripts/.venv
scripts/.venv/bin/pip install -r scripts/requirements.txt
```

### 准备 Cookie（必需）

1. 用浏览器登录 <https://www.douban.com>
2. 打开 DevTools（F12）→ Network 面板
3. 刷新一下首页，点列表里任意 `douban.com` 的请求
4. 右侧 Headers → Request Headers → 找到 `Cookie:` 这一整行
5. **只复制冒号后面的值**，保存到下列路径（一行，不要换行）：

   ```text
   ~/Library/Application Support/ayaya-blog/douban-cookie.txt
   ```

6. 限制文件权限：

   ```bash
   chmod 600 ~/Library/Application\ Support/ayaya-blog/douban-cookie.txt
   ```

Cookie 保存在 repo 外，不会被提交。环境变量 `DOUBAN_SYNC_CONFIG_DIR`、
`DOUBAN_COOKIE_FILE` 和 `DOUBAN_USER_ID` 可以覆盖默认设置。

### 同步

```bash
# 抓全部（电影 + 图书）
npm run sync:douban

# 只抓电影
npm run sync:douban -- movie

# 只抓图书
npm run sync:douban -- book

# 一次同步 YouTube + 豆瓣
npm run sync:entertainment
```

输出文件：

- `src/data/douban/movies.json`
- `src/data/douban/books.json`

同步会增量复用已下载封面；如果 Cookie 失效或第一页解析为空，会立即停止并
保留原 JSON，避免把博客数据误清空。

### 可能的问题

- **被重定向到登录页**：Cookie 失效，重新复制
- **抓到空列表**：豆瓣 DOM 结构变了，需要更新 `parse_movie_item` / `parse_book_item`
- **海报加载不出来**：博客模板里 `<img>` 已经加了 `referrerpolicy="no-referrer"`，
  如果还有问题，可能是豆瓣图片 CDN 临时抽风
