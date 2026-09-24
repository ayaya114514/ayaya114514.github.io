import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const failures = []
const warnings = []
// 每个 public 目录里被 JSON 引用到的文件，用来找出不再被引用但仍会发布的图片。
const referencedAssets = new Map()

const datasets = [
  {
    label: 'bands',
    file: 'src/data/bands.json',
    required: ['slug', 'display', 'link'],
    unique: ['slug', 'link'],
    urls: ['link'],
    asset: 'avatar',
    assetDir: 'band-avatars/thumbs'
  },
  {
    label: 'YouTube subscriptions',
    file: 'src/data/youtube-subs.json',
    required: ['id', 'title', 'url'],
    unique: ['id', 'url'],
    urls: ['url'],
    asset: 'avatar',
    assetDir: 'youtube-avatars/thumbs'
  },
  {
    label: 'Douban movies',
    file: 'src/data/douban/movies.json',
    required: ['title', 'url'],
    unique: ['url'],
    urls: ['url'],
    asset: 'cover',
    assetDir: 'images/douban'
  },
  {
    label: 'Douban books',
    file: 'src/data/douban/books.json',
    required: ['title', 'url'],
    unique: ['url'],
    urls: ['url'],
    asset: 'cover',
    assetDir: 'images/douban'
  }
]

function report(message) {
  failures.push(message)
}

function isWebUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

async function validateAsset(label, index, field, value) {
  if (value == null) return

  if (typeof value !== 'string' || !value.startsWith('/')) {
    report(`${label} item ${index + 1}: ${field} must be a root-relative local path or null`)
    return
  }

  const absolute = path.resolve(PUBLIC_DIR, value.slice(1))
  if (!absolute.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    report(`${label} item ${index + 1}: ${field} escapes public/`)
    return
  }

  try {
    const file = await stat(absolute)
    if (!file.isFile()) report(`${label} item ${index + 1}: ${value} is not a file`)
    else if (file.size === 0) report(`${label} item ${index + 1}: ${value} is empty`)
  } catch {
    report(`${label} item ${index + 1}: missing public asset ${value}`)
  }
}

function referenced(assetDir) {
  if (!referencedAssets.has(assetDir)) referencedAssets.set(assetDir, new Set())
  return referencedAssets.get(assetDir)
}

// 孤儿图只记 warning：退订频道等正常同步也会留下旧图，不应让 sync:entertainment 因此回滚。
async function findOrphanAssets() {
  for (const [assetDir, used] of referencedAssets) {
    const directory = path.join(PUBLIC_DIR, assetDir)
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (!entry.isFile() || entry.name.startsWith('.')) continue
      const absolute = path.join(directory, entry.name)
      if (!used.has(absolute)) warnings.push(`unreferenced public asset /${assetDir}/${entry.name}`)
    }
  }
}

async function validateDataset(spec) {
  let payload
  try {
    payload = JSON.parse(await readFile(path.join(ROOT, spec.file), 'utf8'))
  } catch (error) {
    report(`${spec.label}: cannot read valid JSON (${error.message})`)
    return 0
  }

  if (!Array.isArray(payload.items)) {
    report(`${spec.label}: items must be an array`)
    return 0
  }
  if (payload.items.length === 0) report(`${spec.label}: items must not be empty`)
  if (!Number.isInteger(payload.count) || payload.count !== payload.items.length) {
    report(`${spec.label}: count ${payload.count} does not match ${payload.items.length} items`)
  }
  if (typeof payload.updated_at !== 'string' || payload.updated_at.trim() === '') {
    report(`${spec.label}: updated_at must be a non-empty string`)
  }

  const seen = new Map(spec.unique.map((field) => [field, new Set()]))
  for (const [index, item] of payload.items.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      report(`${spec.label} item ${index + 1}: item must be an object`)
      continue
    }

    for (const field of spec.required) {
      if (typeof item[field] !== 'string' || item[field].trim() === '') {
        report(`${spec.label} item ${index + 1}: ${field} must be a non-empty string`)
      }
    }
    for (const field of spec.urls) {
      if (typeof item[field] === 'string' && !isWebUrl(item[field])) {
        report(`${spec.label} item ${index + 1}: ${field} is not an HTTP(S) URL`)
      }
    }
    for (const field of spec.unique) {
      if (typeof item[field] !== 'string' || item[field].trim() === '') continue
      const value = item[field].trim()
      if (seen.get(field).has(value)) {
        report(`${spec.label} item ${index + 1}: duplicate ${field} ${value}`)
      }
      seen.get(field).add(value)
    }

    await validateAsset(spec.label, index, spec.asset, item[spec.asset])
    if (typeof item[spec.asset] === 'string') {
      referenced(spec.assetDir).add(path.resolve(PUBLIC_DIR, item[spec.asset].slice(1)))
    }
  }

  return payload.items.length
}

const counts = []
for (const dataset of datasets) {
  counts.push(`${dataset.label}: ${await validateDataset(dataset)}`)
}

await findOrphanAssets()
if (warnings.length > 0) {
  console.warn(`Data validation found ${warnings.length} warning(s):`)
  for (const warning of warnings) console.warn(`- ${warning}`)
}

if (failures.length > 0) {
  console.error(`Data validation failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Data validation passed (${counts.join(', ')})`)
}
