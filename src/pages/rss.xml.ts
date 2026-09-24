import type { CollectionEntry } from 'astro:content'
import rss from '@astrojs/rss'
import config from 'virtual:config'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

const GET = async () => {
  const allPostsByDate = sortMDByDate(await getBlogCollection()) as CollectionEntry<'blog'>[]

  return rss({
    // Basic configs
    trailingSlash: true,
    stylesheet: '/scripts/pretty-feed-v3.xsl',

    // Contents
    title: config.title,
    description: config.description,
    site: import.meta.env.SITE,
    // 只在文章自己写了 description 时输出；论文速读等没有摘要的文章不再重复站点简介。
    items: allPostsByDate.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`
    }))
  })
}

export { GET }
