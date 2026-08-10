# 娱乐数据同步脚本

## YouTube 订阅

`youtube_sync.mjs` 通过 YouTube Data API v3 读取当前授权账号的订阅频道，
并更新 `src/data/youtube-subs.json` 和缺失的频道头像。旧的
`import_youtube_subs.mjs` 仍可用于导入 Google Takeout CSV。
页面使用的头像会自动生成到 `public/youtube-avatars/thumbs/`，格式为
160×160 WebP；原图保留在不会被 Astro 发布的
`assets/raw/youtube-avatars/`，仅用于后续重新生成缩略图。

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

Takeout fallback 只接受原始三列表头
`Channel Id,Channel Url,Channel Title`。空数据、列数错误、无效/重复的频道 ID
或 URL 都会 fail closed；频道页或头像暂时无法下载时则保留有效频道，并使用已有
thumbnail 或无图占位。正式 JSON 采用同目录 temporary file + rename 写入。

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

同步会增量复用已下载封面；如果 Cookie 失效、任意分页解析为空、关键字段缺失
或结果重复，会立即停止并保留原 JSON，避免用空数据或不完整数据覆盖博客。
`all` 模式会先完整抓取、验证和本地化电影与图书，最后才 batch commit 两个 JSON；
任一替换失败会从 byte-for-byte backup 回滚，避免留下新旧混合快照。

`npm run sync:entertainment` 会先为 YouTube、电影和图书三个 authoritative JSON
建立同目录、已 fsync 的 durable backup，再执行同步；两条同步命令或最终
`validate:data` 任一步失败/中止时，会从 backup 逐文件 atomic restore。只有全部同步
成功，或三份 JSON 已完整恢复后才清理 backups；恢复失败时会保留并输出 backup 路径。
新下载但未被 JSON 引用的图片可以安全保留，供下次增量同步复用。
任一来源的新条目数比旧数据减少超过 25% 时也会 fail closed；确认大幅取消订阅或
删除记录是预期行为后，使用
`npm run sync:entertainment -- --allow-large-drop` 显式放行。单独运行 YouTube、
豆瓣或 Takeout fallback 时也支持同名 flag。

## 图片与网络边界

- 页面真正发布的娱乐头像只放在 `public/{youtube-avatars,band-avatars}/thumbs/`。
- YouTube 和乐队头像原图分别位于 `assets/raw/youtube-avatars/`、
  `assets/raw/band-avatars/`；桌搭设备原图位于 `assets/raw/device/`。这些 source
  assets 会被 git 跟踪，但不会进入 GitHub Pages artifact。
- Node 同步脚本的请求使用 15 秒 timeout，对 429/5xx 最多额外重试两次；图片必须
  返回 `image/*` MIME，且 header 和实际 streamed body 都不能超过 8 MiB。
- 已缓存的头像 thumbnail 必须是 regular、非空、可由 Sharp 完整解码的 160×160
  WebP；无效缓存会从 raw source 重建，无法重建时绝不会把损坏路径写入 JSON。
- `public/images/desksetup/` 下可点击查看的桌搭照片原图仍属于正式站点资源，不移动。

### 可能的问题

- **被重定向到登录页**：Cookie 失效，重新复制
- **抓到空列表**：豆瓣 DOM 结构变了，需要更新 `parse_movie_item` / `parse_book_item`
- **海报加载不出来**：同步脚本会把封面下载到 `public/images/douban/`；检查 JSON
  中的本地路径是否存在，以及图片下载阶段是否出现 HTTP 错误
