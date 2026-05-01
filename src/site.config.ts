import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [Basic]
  title: 'Ayaya114514',
  author: 'ayaya',
  description: '有关 ayaya 的一切',
  favicon: '/favicon/favicon.ico',
  socialCard: '/images/social-card.png',
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    dateLocale: 'zh-CN',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  logo: {
    src: '/src/assets/avatar.jpg',
    alt: 'Avatar'
  },

  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  head: [],
  customCss: [],

  /** 顶部导航 */
  header: {
    menu: [
      { title: '首页', link: '/' },
      { title: '笔记', link: '/blog' },
      { title: '娱乐', link: '/entertainment' },
      { title: '桌搭', link: '/desksetup' },
      { title: '设备', link: '/devices' },
      { title: '关于', link: '/about' }
    ]
  },

  /** 底部 */
  footer: {
    year: `© ${new Date().getFullYear()}`,
    links: [],
    credits: true,
    social: [
      { icon: 'github', label: 'GitHub', href: 'https://github.com/ayaya114514' },
      { icon: 'rss', label: 'RSS', href: '/rss.xml' }
    ]
  },

  // [Content]
  content: {
    externalLinks: {
      content: ' ↗',
      properties: { style: 'user-select:none' }
    },
    blogPageSize: 10,
    share: []
  }
}

export const integ: IntegrationUserConfig = {
  // [Search]
  pagefind: true,
  // [Quote]
  quote: {
    server: 'https://dummyjson.com/quotes/random',
    target: `(data) => (data.quote.length > 80 ? \`\${data.quote.slice(0, 80)}...\` : data.quote || 'Error')`
  },
  // [Typography]
  typography: {
    class: 'prose text-base',
    blockquoteStyle: 'italic',
    inlineCodeBlockStyle: 'modern'
  },
  // [Lightbox]
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // 评论系统暂时关掉，需要时可以再开
  waline: {
    enable: false,
    server: '',
    showMeta: false,
    emoji: [],
    additionalConfigs: {}
  }
}

const config = { ...theme, integ } as Config
export default config
