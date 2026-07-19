# 项目速记（给未来的 Codex / 也方便我自己回顾）

> 只记"读代码看不出来的约定"。技术栈、目录结构、依赖版本请直接看
> `package.json` / `astro.config.ts` / 各组件源文件。

## 子板块（sub-section）是 load-bearing 概念

博客文章按 `src/content/blog/<group>/<slug>.md` 组织，**`id` 的第一段**
（`machine-learning` / `paper-digest` / `miscellaneous` …）被当作"子板块"，
有两处依赖它，改一处要同时想另一处：

- 左侧目录：`src/components/blog/Directory.astro` 按它分组，组名映射在
  `groupNameMap`、显示顺序在 `groupOrder`，新增分组要同步加。
- 底部上一篇/下一篇：`src/layouts/BlogPost.astro` 把 `posts` 过滤到当前
  子板块再传给 `ArticleBottom`，**翻页不跨板块**（边界处那侧直接不渲染按钮）。

## 章节笔记按 `id` 升序，而不是 publishDate 倒序

`astro-pure` 默认给的 `posts` 是按日期倒序的。对带数字前缀的笔记
（`00-prelude` / `01-linear-regression`）会让"序号大的"排在前面，
底部 prev/next 就反了。`BlogPost.astro` 已经统一改成 `id` 升序，
与左侧目录一致。新增章节请用 `NN-xxx` 的命名习惯保持可排序。

## `ArticleBottom` 来自 `node_modules/astro-pure`，不要去改 lib

底部翻页组件是第三方的，已经踩过两次：
1. 排序方向反了（见上）
2. 跨子板块跳转

调整行为只能通过传入的 `collections` 这一个接口（先 filter、再 sort），
不要 patch node_modules。

## 自动锚点 class 是 `anchor`，CSS 选择器必须带它

`astro.config.ts` 里 `rehypeAutolinkHeadings.properties.className = ['anchor']`
给每个 `<h*>` 追加了一个 `<a class="anchor">#</a>`。
**`uno.config.ts` 里写"默认隐藏标题锚点"的规则必须是 `h*>a.anchor`，
不能写 `h*>a`**——后者会把 Markdown 标题里你自己写的 `<a>` 也一起藏掉
（例如 `### 1. [论文标题](url)`，标题文字直接看不见）。

## 全站强制暗色，by design

`src/layouts/BaseLayout.astro` 顶部硬给 `<html>` 加了 `dark` class、
覆盖 `localStorage` 的 `theme`、改 `theme-color` meta。这是用户主动
要求的"只用暗色"，不要当作主题切换 bug 去"修复"。

## 站点元配置

- `src/site.config.ts`：站点名 / 菜单 / typography 配置，新增菜单板块
  要顺便在 `src/pages/<板块>/` 下建页面。
- `output: 'static'` + `site: 'https://ayaya114514.github.io'`
  （`astro.config.ts`），部署目标是 GitHub Pages。

## scripts/ 用途

娱乐板块有两条长期同步链路，详细用法统一看 `scripts/README.md`：

- 豆瓣：`scripts/douban_sync.py` 把"看过的电影 / 读过的书"写入
  `src/data/douban/{movies,books}.json`。日常运行 `npm run sync:douban`；Cookie
  默认只保存在 `~/Library/Application Support/ayaya-blog/douban-cookie.txt`，
  不得复制进 repo、打印或提交。抓取失败或第一页为空时必须保留旧数据。
- YouTube：`npm run sync:youtube` 使用 YouTube Data API v3 的
  `youtube.readonly` scope，更新 `src/data/youtube-subs.json` 并下载缺失头像到
  `public/youtube-avatars/`。OAuth client 和 token 默认只保存在
  `~/Library/Application Support/ayaya-blog/`，不得复制进 repo、打印或提交；
  日常同步不需要重新下载 Takeout 文件。

`scripts/import_youtube_subs.mjs` 只保留为 Google Takeout CSV 的 fallback。
其它 `.mjs` 脚本（`gen_favicon` / `import_bands`）是一次性导入工具。
需要同时更新娱乐板块的两类账号数据时运行 `npm run sync:entertainment`。

## 娱乐数据的自然语言触发约定

下面这些请求已经足够明确，视为用户同时授权数据同步、博客更新、scoped
commit 和 `git push`，无需再复述方案或要求二次确认：

- “同步油管” / “更新 YouTube”：运行 `npm run sync:youtube`。
- “同步豆瓣” / “更新电影和书籍”：运行 `npm run sync:douban`。
- “同步油管和豆瓣” / “同步娱乐数据”：运行 `npm run sync:entertainment`。

同步完成后必须核对 JSON 条目数、重复 URL、本地图片缺失和 credential
isolation，再运行 `npm run lint`、`npm run check`、`npm run build`。只 stage
本次同步产生的数据、图片和必要代码/文档，commit 后 push 当前分支。OAuth
或 Cookie 失效时停止，不得覆盖旧数据；只有需要重新登录或授权时才询问用户。

> paper-digest 目录下的论文速读 Markdown 目前是外部生成后手动放进来的，
> repo 里没有抓取脚本——如果以后要做自动化，需要新增。
