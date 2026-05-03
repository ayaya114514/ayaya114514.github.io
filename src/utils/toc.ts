import type { MarkdownHeading } from 'astro'

/**
 * 嵌套化 markdown 标题：把扁平的 `[h2, h3, h3, h2, ...]` 列表组装成
 * `{ depth, slug, text, subheadings: [...] }` 的树结构。
 *
 * 这个函数和 astro-pure 内部的 `generateToc` 行为一致，但 astro-pure
 * 没有把 plugins 子路径暴露到 package.json 的 exports 字段，直接 import
 * 会被 Vite 解析失败，所以这里就地维护一份给左侧栏组件复用。
 */
export interface TocItem extends MarkdownHeading {
  subheadings: TocItem[]
}

export function generateToc(headings: readonly MarkdownHeading[]): TocItem[] {
  const root: TocItem = { depth: 0, slug: 'root', text: 'Root', subheadings: [] }
  const stack: TocItem[] = [root]
  headings.forEach((h) => {
    const node: TocItem = { ...h, subheadings: [] }
    while (stack[stack.length - 1].depth >= node.depth) stack.pop()
    stack[stack.length - 1].subheadings.push(node)
    stack.push(node)
  })
  return root.subheadings
}
