export const BLOG_ROOT_GROUP = '__root__'

export const blogGroups = [
  {
    slug: 'machine-learning',
    title: '机器学习',
    description: '课程学习、基础概念与模型实现笔记。'
  },
  {
    slug: 'paper-digest',
    title: '论文抓取',
    description: '生命科学与机器学习论文的周期性速读记录。'
  },
  {
    slug: 'miscellaneous',
    title: '杂项',
    description: '暂未归入固定系列的技术记录与说明。'
  }
] as const

export function getBlogGroupKey(postId: string) {
  const segments = postId.split('/')
  return segments.length > 1 ? segments[0] : BLOG_ROOT_GROUP
}

export function normalizeRoutePath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

export function isSectionActive(currentPath: string, sectionPath: string) {
  const current = normalizeRoutePath(currentPath)
  const section = normalizeRoutePath(sectionPath)

  return section === '/'
    ? current === '/'
    : current === section || current.startsWith(`${section}/`)
}
