# ayaya114514.github.io

个人博客，主要存放 markdown 笔记。

- 框架：[Astro](https://astro.build/)
- 主题：[astro-theme-pure](https://github.com/cworld1/astro-theme-pure)
- 部署：GitHub Pages（通过 `.github/workflows/deploy.yml` 自动构建并发布）

## 写笔记

把 markdown 文件丢到 `src/content/blog/` 即可，frontmatter 必须包含：

```yaml
---
title: 文章标题（≤ 60 字）
description: 一句话描述（≤ 160 字）
publishDate: 2026-04-28
tags: [标签1, 标签2]   # 可选
draft: false           # 可选，true 则不发布
---
```

支持普通 Markdown 与 MDX。代码块支持语法高亮、折叠、复制按钮。

## 写日记

把 markdown 文件丢到 `src/content/diary/`，frontmatter 仅需：

```yaml
---
publishDate: 2026-04-28
---
```

正文是纯文本。日记会显示在 `/diary` 页面。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

产物在 `dist/`。push 到 `main` 分支后由 GitHub Actions 自动部署。

## 首次启用 Pages

仓库 Settings → Pages → Source 选 **GitHub Actions** 即可。
