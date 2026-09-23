@AGENTS.md

> `AGENTS.md` 是本项目约定的唯一来源（Codex 与 Claude Code 共用），改约定只改 `AGENTS.md`；
> 文中 “Codex” 即当前 agent。下面是从 Codex 记忆迁移的补充经验。

## 验证与发布

- 验证：`source ~/.nvm/nvm.sh && nvm use 22 && npm run verify`（format check、ESLint、
  Astro check、data validation、production build）。Node 20 会失败。
- 发布收尾：`npm run verify` → 只 stage 目标文件 → `git push origin main` →
  `gh run watch <run-id> --exit-status`（push 后 run 可能延迟注册，按分支查）→
  线上 HTTP / 内容 smoke check → 确认工作区干净。
- 依赖链 `npm audit` advisory（Astro / astro-pure）不要强行 major 升级，除非先做兼容性评估。

## 页面约定

- 工具页 `src/pages/tools/index.astro`：`tools` 数组同时驱动卡片和
  `<nav slot='sidebar' aria-label='工具目录'>` 侧边栏；公开路由 `/tools/`。
  新增外部工具只追加到数组中用户指定的位置，不改 header/nav。
- 笔记侧边栏显示全部分组，只默认展开当前分组，其余保留 `<details>` 手动展开。
- 首页：名字 / 头像在 `src/site.config.ts`，简介与联系方式在 `src/pages/index.astro`；
  邮箱故意以 `anyangyang2022_at_gmail.com` 纯文本显示，不做 `mailto:`。
- 歌词：目录 `src/data/lyrics.ts`，正文 `src/data/*-lyrics.json`，歌名翻译
  `src/data/lyric-title-translations.json`。层级是 艺人 → 专辑/单曲 → 歌曲，
  不要封面和年份；只有存在已审核正文的歌曲才生成链接，其余保持纯文本；
  不要用未审核的机翻（“不要垃圾的翻译”）。

## 坑

- 线上断言数 sidebar 展开组时，`<summary>` 里嵌套 SVG 会让简单 regex 误判；用 parser。
- Pages smoke test 偶发 `SSLEOFError`：带 User-Agent 的 `requests.Session` 逐页重试（≤4 次）。
- 没装 `tsx` 时，审计 TS 数据可用已安装 TypeScript 的 `transpileModule`。
