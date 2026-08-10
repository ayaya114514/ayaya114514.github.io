import { getBlogCollection } from 'astro-pure/server'

let landingHref: Promise<string> | undefined

/** Resolve the first note using the same stable id ordering as the blog directory. */
export function getBlogLandingHref() {
  landingHref ??= getBlogCollection().then((posts) => {
    const first = [...posts].sort((a, b) => a.id.localeCompare(b.id))[0]
    return first ? `/blog/${first.id}/` : '/'
  })

  return landingHref
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
