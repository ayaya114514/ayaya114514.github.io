#!/usr/bin/env node
// 把 Google Takeout 导出的 YouTube 订阅 CSV 转成站点 JSON，
// 顺便抓取每个频道的头像（og:image）下载到 assets/raw/youtube-avatars/，
// 并生成 160px WebP 展示图到 public/youtube-avatars/thumbs/。
//
// 用法：
//   node scripts/import_youtube_subs.mjs [csv_path] [--allow-large-drop]
// 默认读取用户 Takeout 路径，没传参时用它。
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const DEFAULT_CSV = '/Users/ayaya/Downloads/Takeout/YouTube 和 YouTube Music/订阅内容/订阅内容.csv'
const OUT_JSON = path.join(ROOT, 'src/data/youtube-subs.json')
const AVATAR_SOURCE_DIR = path.join(ROOT, 'assets/raw/youtube-avatars')
const AVATAR_THUMB_DIR = path.join(ROOT, 'public/youtube-avatars/thumbs')
const AVATAR_THUMB_PUBLIC_PREFIX = '/youtube-avatars/thumbs'
const AVATAR_THUMB_SIZE = 160
const AVATAR_THUMB_QUALITY = 80
const EXPECTED_HEADER = ['Channel Id', 'Channel Url', 'Channel Title']
const FETCH_TIMEOUT_MS = 15_000
const FETCH_RETRIES = 2
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_HTML_BYTES = 2 * 1024 * 1024
const MAX_CSV_BYTES = 10 * 1024 * 1024
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36'

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

async function readJsonIfPresent(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function assertNoLargeDrop(previous, nextCount, allowLargeDrop) {
  const previousCount = Array.isArray(previous?.items) ? previous.items.length : 0
  if (previousCount === 0 || nextCount * 4 >= previousCount * 3) return
  const detail = `YouTube subscriptions 从 ${previousCount} 降到 ${nextCount}（超过 25%）`
  if (!allowLargeDrop) {
    throw new Error(`${detail}；为避免异常 CSV 覆盖旧数据，本次停止。确认后可加 --allow-large-drop`)
  }
  console.warn(`[!] ${detail}；已按 --allow-large-drop 继续`)
}

function parseArguments(argv) {
  const allowedOptions = new Set(['--allow-large-drop'])
  const unknown = argv.filter((arg) => arg.startsWith('--') && !allowedOptions.has(arg))
  if (unknown.length) throw new Error(`未知选项：${unknown.join(', ')}`)
  const positional = argv.filter((arg) => !arg.startsWith('--'))
  if (positional.length > 1)
    throw new Error('用法：import_youtube_subs.mjs [csv_path] [--allow-large-drop]')
  return {
    csvPath: positional[0] || DEFAULT_CSV,
    allowLargeDrop: argv.includes('--allow-large-drop')
  }
}

// --- 极简 CSV 解析（处理引号 / 转义引号 / 换行）---
function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuote = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuote = false
        }
      } else {
        cell += c
      }
    } else {
      if (c === '"') inQuote = true
      else if (c === ',') {
        row.push(cell)
        cell = ''
      } else if (c === '\n') {
        row.push(cell)
        rows.push(row)
        row = []
        cell = ''
      } else if (c === '\r') {
        // ignore
      } else cell += c
    }
  }
  if (cell.length || row.length) {
    row.push(cell)
    rows.push(row)
  }
  if (inQuote) throw new Error('CSV 含未闭合的引号')
  return rows.filter((r) => r.some((v) => v.trim() !== ''))
}

function validateTakeoutRows(rows) {
  if (rows.length === 0) throw new Error('CSV 为空')
  const [rawHeader, ...data] = rows
  const header = rawHeader.map((cell, index) =>
    (index === 0 ? cell.replace(/^\uFEFF/, '') : cell).trim()
  )
  if (
    header.length !== EXPECTED_HEADER.length ||
    !header.every((cell, i) => cell === EXPECTED_HEADER[i])
  ) {
    throw new Error(
      `CSV 表头不匹配；预期 ${EXPECTED_HEADER.join(' | ')}，实际 ${header.join(' | ')}`
    )
  }
  if (data.length === 0) throw new Error('CSV 没有订阅数据；为避免覆盖旧数据，本次停止')

  const ids = new Set()
  const urls = new Set()
  return data.map((row, index) => {
    const rowNumber = index + 2
    if (row.length !== EXPECTED_HEADER.length) {
      throw new Error(`CSV 第 ${rowNumber} 行列数不是 ${EXPECTED_HEADER.length}`)
    }
    const [id, rawUrl, title] = row.map((cell) => cell.trim())
    if (!/^UC[A-Za-z0-9_-]{22}$/.test(id) || !title) {
      throw new Error(`CSV 第 ${rowNumber} 行缺少有效 channel id/title`)
    }

    let parsed
    try {
      parsed = new URL(rawUrl)
    } catch {
      throw new Error(`CSV 第 ${rowNumber} 行 URL 无效：${rawUrl}`)
    }
    const host = parsed.hostname.toLowerCase()
    const pathname = parsed.pathname.replace(/\/+$/, '')
    if (
      !['http:', 'https:'].includes(parsed.protocol) ||
      !['youtube.com', 'www.youtube.com'].includes(host) ||
      pathname !== `/channel/${id}` ||
      parsed.username ||
      parsed.password
    ) {
      throw new Error(`CSV 第 ${rowNumber} 行不是对应频道的 YouTube URL：${rawUrl}`)
    }

    const url = `https://www.youtube.com/channel/${id}`
    if (ids.has(id) || urls.has(url)) {
      throw new Error(`CSV 第 ${rowNumber} 行重复频道：${id}`)
    }
    ids.add(id)
    urls.add(url)
    return { id, url, title }
  })
}

// 从 HTML 中按属性顺序无关地提取 og:image
function extractOgImage(html) {
  // <meta property="og:image" content="..."> 或 content 在前
  const re1 = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  const re2 = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  const m = html.match(re1) || html.match(re2)
  return m ? m[1] : null
}

async function fetchText(url) {
  const res = await fetchWithRetry(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    },
    redirect: 'follow'
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const contentType = (res.headers.get('content-type') || '').toLowerCase()
  if (!contentType.startsWith('text/html') && !contentType.startsWith('application/xhtml+xml')) {
    throw new Error(`unexpected content-type: ${contentType || 'unknown'}`)
  }
  return (await readLimitedBuffer(res, MAX_HTML_BYTES, 'HTML')).toString('utf8')
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

async function processChannel({ id, url, title }) {
  const localPath = path.join(AVATAR_SOURCE_DIR, `${id}.jpg`)
  const thumbnailPath = path.join(AVATAR_THUMB_DIR, `${id}.webp`)
  const publicPath = `${AVATAR_THUMB_PUBLIC_PREFIX}/${id}.webp`

  // Public thumbnail 已足够渲染页面；raw source 只在需要重建 thumbnail 时读取。
  if (await isValidAvatarThumbnail(thumbnailPath)) {
    return { id, url, title, avatar: publicPath }
  }
  if (await fileExists(localPath)) {
    try {
      await ensureAvatarThumbnail(localPath, thumbnailPath)
      if (await isValidAvatarThumbnail(thumbnailPath)) {
        return { id, url, title, avatar: publicPath }
      }
    } catch (e) {
      console.warn(`  ! 本地头像无法重建 ${id}: ${e.message}`)
    }
  }

  let avatarUrl = null
  try {
    const html = await fetchText(url)
    avatarUrl = extractOgImage(html)
  } catch (e) {
    console.warn(`  ! 抓取频道页失败 ${id}: ${e.message}`)
  }

  if (avatarUrl) {
    try {
      await downloadAvatar(avatarUrl, localPath, thumbnailPath)
      return { id, url, title, avatar: publicPath }
    } catch (e) {
      console.warn(`  ! 下载头像失败 ${id}: ${e.message}`)
    }
  }

  return { id, url, title, avatar: null }
}

async function main() {
  const { csvPath, allowLargeDrop } = parseArguments(process.argv.slice(2))
  console.log(`[*] 读取 CSV: ${csvPath}`)
  const csvStats = await fs.stat(csvPath)
  if (csvStats.size > MAX_CSV_BYTES) {
    throw new Error(`CSV 超过 ${MAX_CSV_BYTES / 1024 / 1024} MiB 上限`)
  }
  const csv = await fs.readFile(csvPath, 'utf8')
  const rows = parseCsv(csv)
  const channels = validateTakeoutRows(rows)
  assertNoLargeDrop(await readJsonIfPresent(OUT_JSON), channels.length, allowLargeDrop)
  console.log(`[*] 表头: ${EXPECTED_HEADER.join(' | ')}`)
  console.log(`[*] 共 ${channels.length} 个频道`)

  await Promise.all([
    fs.mkdir(AVATAR_SOURCE_DIR, { recursive: true }),
    fs.mkdir(AVATAR_THUMB_DIR, { recursive: true })
  ])

  const items = []
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i]
    process.stdout.write(`  [${i + 1}/${channels.length}] ${channel.title} ... `)
    const item = await processChannel(channel)
    items.push(item)
    console.log(item.avatar ? 'ok' : '无头像')
    // 给 YouTube 一点喘息时间
    await sleep(250)
  }

  if (items.length !== channels.length || items.length === 0) {
    throw new Error('频道处理结果不完整；为避免覆盖旧数据，本次停止')
  }

  // 按标题字母 / 假名 / 拼音排序，保持稳定
  items.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'))

  const payload = {
    count: items.length,
    updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    items
  }
  await writeJsonAtomic(OUT_JSON, payload)
  console.log(`[*] 写入 ${OUT_JSON}（${items.length} 条）`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
