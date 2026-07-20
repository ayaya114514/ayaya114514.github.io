import type { CollectionEntry } from 'astro:content'
import rss from '@astrojs/rss'
import config from 'virtual:config'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

const GET = async () => {
  const allPostsByDate = sortMDByDate(await getBlogCollection()) as CollectionEntry<'blog'>[]
  const feedPosts = allPostsByDate.slice(0, config.content.blogPageSize ?? 10)

  return rss({
    // Basic configs
    trailingSlash: false,
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
    stylesheet: '/scripts/pretty-feed-v3.xsl',

    // Contents
    title: config.title,
    description: config.description,
    site: import.meta.env.SITE,
    items: feedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}`
    }))
  })
}

export { GET }
