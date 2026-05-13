# 项目速记（给未来的 Claude / 也方便我自己回顾）

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

只有一组脚本：把豆瓣"看过的电影 / 读过的书"抓下来，写入
`src/data/douban/{movies,books}.json`，给娱乐板块用。
入口 `scripts/douban_sync.py`，详细用法看 `scripts/README.md`。
`scripts/cookie.txt` 是登录态、已经在 `.gitignore` 里，不要提交。

其它 `.mjs` 脚本（`gen_favicon` / `import_bands` / `import_youtube_subs`）
是一次性导入工具，跑过一次就不用动了。

> paper-digest 目录下的论文速读 Markdown 目前是外部生成后手动放进来的，
> repo 里没有抓取脚本——如果以后要做自动化，需要新增。
