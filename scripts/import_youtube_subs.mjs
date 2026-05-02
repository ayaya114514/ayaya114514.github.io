#!/usr/bin/env node
// 把 Google Takeout 导出的 YouTube 订阅 CSV 转成站点 JSON，
// 顺便抓取每个频道的头像（og:image）下载到 public/youtube-avatars/。
//
// 用法：
//   node scripts/import_youtube_subs.mjs [csv_path]
// 默认读取用户 Takeout 路径，没传参时用它。

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const DEFAULT_CSV =
  '/Users/ayaya/Downloads/Takeout/YouTube 和 YouTube Music/订阅内容/订阅内容.csv'
const OUT_JSON = path.join(ROOT, 'src/data/youtube-subs.json')
const AVATAR_DIR = path.join(ROOT, 'public/youtube-avatars')
const AVATAR_PUBLIC_PREFIX = '/youtube-avatars'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36'

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
  return rows.filter((r) => r.some((v) => v.trim() !== ''))
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
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    },
    redirect: 'follow'
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

async function downloadBinary(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(dest, buf)
}

async function processChannel({ id, url, title }) {
  const localPath = path.join(AVATAR_DIR, `${id}.jpg`)
  const publicPath = `${AVATAR_PUBLIC_PREFIX}/${id}.jpg`

  // 已有头像就不重新下载
  let exists = false
  try {
    await fs.access(localPath)
    exists = true
  } catch {}

  if (exists) {
    return { id, url, title, avatar: publicPath }
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
      await downloadBinary(avatarUrl, localPath)
      return { id, url, title, avatar: publicPath }
    } catch (e) {
      console.warn(`  ! 下载头像失败 ${id}: ${e.message}`)
    }
  }

  return { id, url, title, avatar: null }
}

async function main() {
  const csvPath = process.argv[2] || DEFAULT_CSV
  console.log(`[*] 读取 CSV: ${csvPath}`)
  const csv = await fs.readFile(csvPath, 'utf8')
  const rows = parseCsv(csv)
  if (rows.length === 0) throw new Error('CSV 为空')
  const [header, ...data] = rows
  console.log(`[*] 表头: ${header.join(' | ')}`)
  console.log(`[*] 共 ${data.length} 个频道`)

  await fs.mkdir(AVATAR_DIR, { recursive: true })

  const items = []
  for (let i = 0; i < data.length; i++) {
    const [id, url, title] = data[i]
    if (!id || !url) continue
    process.stdout.write(`  [${i + 1}/${data.length}] ${title} ... `)
    try {
      const item = await processChannel({ id, url, title })
      items.push(item)
      console.log(item.avatar ? 'ok' : '无头像')
    } catch (e) {
      console.log(`fail: ${e.message}`)
      items.push({ id, url, title, avatar: null })
    }
    // 给 YouTube 一点喘息时间
    await new Promise((r) => setTimeout(r, 250))
  }

  // 按标题字母 / 假名 / 拼音排序，保持稳定
  items.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'))

  const payload = {
    count: items.length,
    updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    items
  }
  await fs.writeFile(OUT_JSON, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`[*] 写入 ${OUT_JSON}（${items.length} 条）`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
