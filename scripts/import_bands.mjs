#!/usr/bin/env node
// 抓取乐队 / 歌手的头像，写到 src/data/bands.json，
// 头像下载到 public/band-avatars/<slug>.jpg。
//
// 数据来源：Wikipedia REST API summary（多语言回退）。
// 用法：node scripts/import_bands.mjs

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const OUT_JSON = path.join(ROOT, 'src/data/bands.json')
const AVATAR_DIR = path.join(ROOT, 'public/band-avatars')
const AVATAR_PUBLIC_PREFIX = '/band-avatars'

const UA =
  'ayaya-blog/1.0 (https://github.com/ayaya114514; anyangyang2022@gmail.com) Node-fetch'

// slug：本地文件名；display：卡片上显示的名字；links：可点击跳转的 URL；
// titles：Wikipedia 标题候选（按 lang 匹配，依次尝试）。
const artists = [
  {
    slug: 'zutomayo',
    display: 'ZUTOMAYO',
    link: 'https://zutomayo.net/',
    titles: { ja: 'ずっと真夜中でいいのに。', en: 'Zutomayo', zh: 'ZUTOMAYO' }
  },
  {
    slug: 'yorushika',
    display: 'ヨルシカ',
    link: 'https://yorushika.com/',
    titles: { ja: 'ヨルシカ', en: 'Yorushika', zh: '夜鹿' }
  },
  {
    slug: 'n-buna',
    display: 'n-buna',
    link: 'https://twitter.com/nbuna_staff',
    titles: { ja: 'ナブナ', en: 'N-buna' }
  },
  {
    slug: 'mrs-green-apple',
    display: 'Mrs.GREEN APPLE',
    link: 'https://mrsgreenapple.com/',
    titles: { ja: 'Mrs. GREEN APPLE', en: 'Mrs. Green Apple', zh: 'Mrs. GREEN APPLE' }
  },
  {
    slug: 'sakanaction',
    display: '鱼韵',
    link: 'https://sakanaction.jp/',
    titles: { ja: 'サカナクション', en: 'Sakanaction', zh: '鯖魚樂團' }
  },
  {
    slug: 'the-beatles',
    display: 'The Beatles',
    link: 'https://www.thebeatles.com/',
    titles: { en: 'The Beatles', zh: '披头士乐队', ja: 'ザ・ビートルズ' }
  },
  {
    slug: 'fujii-kaze',
    display: '藤井 风',
    link: 'https://fujiikaze.com/',
    titles: { ja: '藤井風', en: 'Fujii Kaze', zh: '藤井風' }
  },
  {
    slug: 'orangestar',
    display: 'Orangestar',
    link: 'https://www.youtube.com/user/OrangestarAS/videos',
    titles: { ja: 'Orangestar', en: 'Orangestar' }
  },
  {
    slug: 'radwimps',
    display: 'RADWIMPS',
    link: 'https://radwimps.jp/',
    titles: { en: 'Radwimps', ja: 'RADWIMPS', zh: 'RADWIMPS' }
  },
  {
    slug: 'jj-lin',
    display: '林俊杰',
    link: 'https://www.jjlin.com/',
    titles: { zh: '林俊傑', en: 'JJ Lin', ja: 'JJリン' }
  }
]

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

async function downloadBinary(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(dest, buf)
}

// 找到一个能用的 Wikipedia summary（按提供的 lang/title 顺序尝试），
// 返回 originalimage.source 或 thumbnail.source；都没图就返回 null。
async function findArtistImage(titles) {
  for (const [lang, title] of Object.entries(titles)) {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    try {
      const data = await fetchJson(url)
      if (data.type === 'disambiguation') continue
      const img = data.originalimage?.source || data.thumbnail?.source
      if (img) return { lang, title, img }
    } catch (e) {
      // 404 或网络错，换下一个
    }
  }
  return null
}

async function processArtist(a) {
  const dest = path.join(AVATAR_DIR, `${a.slug}.jpg`)
  let exists = false
  try {
    await fs.access(dest)
    exists = true
  } catch {}

  let avatar = null
  if (exists) {
    avatar = `${AVATAR_PUBLIC_PREFIX}/${a.slug}.jpg`
  } else {
    const found = await findArtistImage(a.titles)
    if (found) {
      try {
        await downloadBinary(found.img, dest)
        avatar = `${AVATAR_PUBLIC_PREFIX}/${a.slug}.jpg`
        console.log(`    via ${found.lang}.wikipedia: ${found.title}`)
      } catch (e) {
        console.warn(`    ! 下载失败: ${e.message}`)
      }
    } else {
      console.warn('    ! Wikipedia 未找到图片')
    }
  }

  return {
    slug: a.slug,
    display: a.display,
    link: a.link,
    avatar
  }
}

async function main() {
  await fs.mkdir(AVATAR_DIR, { recursive: true })
  const items = []
  for (let i = 0; i < artists.length; i++) {
    const a = artists[i]
    console.log(`[${i + 1}/${artists.length}] ${a.display}`)
    const item = await processArtist(a)
    items.push(item)
    await new Promise((r) => setTimeout(r, 200))
  }

  const payload = {
    count: items.length,
    updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    items
  }
  await fs.writeFile(OUT_JSON, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`\n[*] 写入 ${OUT_JSON}`)
  console.log(`[*] 头像目录: ${AVATAR_DIR}`)
  const missing = items.filter((x) => !x.avatar).map((x) => x.display)
  if (missing.length) {
    console.log(`[!] 缺图片: ${missing.join(', ')}`)
    console.log('    可手动放 public/band-avatars/<slug>.jpg 后重跑脚本，或保留无图占位。')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
