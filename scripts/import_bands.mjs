#!/usr/bin/env node
// 抓取乐队 / 歌手的头像，写到 src/data/bands.json，
// 原头像下载到 assets/raw/band-avatars/<slug>.jpg，仅用于生成 thumbnail；页面使用
// public/band-avatars/thumbs/<slug>.webp 下的 160px WebP 展示图。
//
// 数据来源：Wikipedia REST API summary（多语言回退）。
// 用法：node scripts/import_bands.mjs
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const OUT_JSON = path.join(ROOT, 'src/data/bands.json')
const AVATAR_SOURCE_DIR = path.join(ROOT, 'assets/raw/band-avatars')
const AVATAR_THUMB_DIR = path.join(ROOT, 'public/band-avatars/thumbs')
const AVATAR_THUMB_PUBLIC_PREFIX = '/band-avatars/thumbs'
const AVATAR_THUMB_SIZE = 160
const AVATAR_THUMB_QUALITY = 80
const FETCH_TIMEOUT_MS = 15_000
const FETCH_RETRIES = 2
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

const UA = 'ayaya-blog/1.0 (https://github.com/ayaya114514; anyangyang2022@gmail.com) Node-fetch'

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function retryDelay(response, attempt) {
  const retryAfter = response?.headers.get('retry-after')?.trim()
  if (retryAfter && /^\d+(?:\.\d+)?$/.test(retryAfter)) {
    return Math.min(Number(retryAfter) * 1000, 15_000)
  }
  return Math.min(750 * 2 ** attempt, 6_000) + Math.floor(Math.random() * 250)
}

async function fetchWithRetry(url, init = {}) {
  for (let attempt = 0; attempt <= FETCH_RETRIES; attempt++) {
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS)
    let response
    try {
      response = await fetch(url, { ...init, signal })
      if (!RETRYABLE_STATUS.has(response.status) || attempt === FETCH_RETRIES) return response
      await response.body?.cancel().catch(() => {})
    } catch (error) {
      if (attempt === FETCH_RETRIES) {
        const detail = ['AbortError', 'TimeoutError'].includes(error.name)
          ? `timeout after ${FETCH_TIMEOUT_MS}ms`
          : error.message
        throw new Error(`网络请求失败: ${detail}`, { cause: error })
      }
    }
    await sleep(retryDelay(response, attempt))
  }
  throw new Error('网络请求失败')
}

async function readLimitedBuffer(response, maxBytes, label) {
  const declaredLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new Error(`${label} exceeds ${maxBytes} byte limit`)
  }
  if (!response.body) throw new Error(`empty ${label} response`)

  const reader = response.body.getReader()
  const chunks = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) throw new Error(`${label} exceeds ${maxBytes} byte limit`)
      chunks.push(Buffer.from(value))
    }
  } catch (error) {
    await reader.cancel(error).catch(() => {})
    throw error
  } finally {
    reader.releaseLock()
  }
  if (total === 0) throw new Error(`empty ${label} response`)
  return Buffer.concat(chunks, total)
}

async function readImageBuffer(response) {
  const contentType = (response.headers.get('content-type') || '').split(';', 1)[0].toLowerCase()
  if (!contentType.startsWith('image/')) {
    throw new Error(`unexpected content-type: ${contentType || 'unknown'}`)
  }
  return await readLimitedBuffer(response, MAX_IMAGE_BYTES, 'image')
}

async function writeJsonAtomic(filePath, payload) {
  const temporary = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}-${crypto.randomBytes(6).toString('hex')}.tmp`
  )
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  try {
    await fs.writeFile(temporary, `${JSON.stringify(payload, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx'
    })
    await fs.rename(temporary, filePath)
  } finally {
    await fs.rm(temporary, { force: true })
  }
}

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
  const res = await fetchWithRetry(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

async function downloadBinary(url, dest) {
  const res = await fetchWithRetry(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await fs.writeFile(dest, await readImageBuffer(res), { flag: 'wx' })
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function isValidAvatarThumbnail(filePath) {
  try {
    const stats = await fs.lstat(filePath)
    if (!stats.isFile() || stats.size === 0) return false
    const metadata = await sharp(filePath, { failOn: 'error' }).metadata()
    if (
      metadata.format !== 'webp' ||
      metadata.width !== AVATAR_THUMB_SIZE ||
      metadata.height !== AVATAR_THUMB_SIZE
    ) {
      return false
    }
    await sharp(filePath, { failOn: 'error' }).raw().toBuffer()
    return true
  } catch {
    return false
  }
}

async function writeAvatarThumbnail(source, destination) {
  const temporary = `${destination}.${process.pid}-${Math.random().toString(16).slice(2)}.tmp`
  await fs.mkdir(path.dirname(destination), { recursive: true })

  try {
    await sharp(source)
      .rotate()
      .resize(AVATAR_THUMB_SIZE, AVATAR_THUMB_SIZE, {
        fit: 'cover',
        position: 'attention'
      })
      .webp({ quality: AVATAR_THUMB_QUALITY, effort: 4 })
      .toFile(temporary)
    await fs.rename(temporary, destination)
    if (!(await isValidAvatarThumbnail(destination))) {
      await fs.rm(destination, { force: true })
      throw new Error(`generated thumbnail failed validation: ${destination}`)
    }
  } finally {
    await fs.rm(temporary, { force: true })
  }
}

async function ensureAvatarThumbnail(source, destination) {
  if (await isValidAvatarThumbnail(destination)) return
  await writeAvatarThumbnail(source, destination)
}

async function downloadAvatar(sourceUrl, destination, thumbnail) {
  const temporary = `${destination}.${process.pid}-${Math.random().toString(16).slice(2)}.tmp`

  try {
    await downloadBinary(sourceUrl, temporary)
    // Sharp decodes the temporary download before either canonical path is used.
    await writeAvatarThumbnail(temporary, thumbnail)
    await fs.rename(temporary, destination)
  } finally {
    await fs.rm(temporary, { force: true })
  }
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
    } catch {
      // 404 或网络错，换下一个
    }
  }
  return null
}

async function processArtist(a) {
  const dest = path.join(AVATAR_SOURCE_DIR, `${a.slug}.jpg`)
  const thumbnail = path.join(AVATAR_THUMB_DIR, `${a.slug}.webp`)
  const publicPath = `${AVATAR_THUMB_PUBLIC_PREFIX}/${a.slug}.webp`

  let avatar = null
  if (await isValidAvatarThumbnail(thumbnail)) {
    avatar = publicPath
  } else if (await fileExists(dest)) {
    try {
      await ensureAvatarThumbnail(dest, thumbnail)
      if (await isValidAvatarThumbnail(thumbnail)) avatar = publicPath
    } catch (e) {
      console.warn(`    ! 本地头像无法重建: ${e.message}`)
    }
  }

  if (!avatar) {
    const found = await findArtistImage(a.titles)
    if (found) {
      try {
        await downloadAvatar(found.img, dest, thumbnail)
        avatar = publicPath
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
  await Promise.all([
    fs.mkdir(AVATAR_SOURCE_DIR, { recursive: true }),
    fs.mkdir(AVATAR_THUMB_DIR, { recursive: true })
  ])
  const items = []
  for (let i = 0; i < artists.length; i++) {
    const a = artists[i]
    console.log(`[${i + 1}/${artists.length}] ${a.display}`)
    const item = await processArtist(a)
    items.push(item)
    await sleep(200)
  }

  const payload = {
    count: items.length,
    updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    items
  }
  await writeJsonAtomic(OUT_JSON, payload)
  console.log(`\n[*] 写入 ${OUT_JSON}`)
  console.log(`[*] 头像 source: ${AVATAR_SOURCE_DIR}`)
  const missing = items.filter((x) => !x.avatar).map((x) => x.display)
  if (missing.length) {
    console.log(`[!] 缺图片: ${missing.join(', ')}`)
    console.log('    可手动放 assets/raw/band-avatars/<slug>.jpg 后重跑脚本，或保留无图占位。')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
