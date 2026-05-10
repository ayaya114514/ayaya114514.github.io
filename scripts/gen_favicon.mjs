// 从 src/assets/avatar.jpg 生成整套 favicon 文件，输出到 public/favicon/
// 用法：node scripts/gen_favicon.mjs
//
// 生成内容：
//   favicon-16x16.png / favicon-32x32.png
//   apple-touch-icon.png (180)
//   android-chrome-192x192.png / android-chrome-512x512.png
//   favicon.ico  —— 包含 16/32/48 三档，使用 PNG 内嵌格式（现代浏览器支持）

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src/assets/avatar.jpg')
const OUT = path.join(ROOT, 'public/favicon')

// 生成单张 PNG buffer：保持方形 cover 裁切（默认头像本身就是方形，这里只是兜底）
async function pngBuffer(size) {
  return await sharp(SRC)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

// 把若干张 PNG 包成一个 .ico
// ICO 文件结构：
//   ICONDIR (6 字节): reserved=0, type=1, count=N
//   ICONDIRENTRY (16 字节) × N
//   接着是各张图片的原始字节（这里直接塞 PNG）
function buildIco(pngs /* [{size, data}] */) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)          // reserved
  header.writeUInt16LE(1, 2)          // type: 1 = ICO
  header.writeUInt16LE(pngs.length, 4) // 图片数量

  const entrySize = 16
  const dirSize = entrySize * pngs.length
  let offset = header.length + dirSize

  const entries = []
  const blobs = []
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(entrySize)
    // 256 在 ICO 里用 0 表示
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2)               // 调色板色数（0=无调色板）
    entry.writeUInt8(0, 3)               // 保留位
    entry.writeUInt16LE(1, 4)            // color planes
    entry.writeUInt16LE(32, 6)           // 每像素位数
    entry.writeUInt32LE(data.length, 8)  // 图像数据大小
    entry.writeUInt32LE(offset, 12)      // 偏移
    entries.push(entry)
    blobs.push(data)
    offset += data.length
  }
  return Buffer.concat([header, ...entries, ...blobs])
}

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  // 普通 PNG 输出
  const targets = [
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512]
  ]
  for (const [name, size] of targets) {
    const buf = await pngBuffer(size)
    await fs.writeFile(path.join(OUT, name), buf)
    console.log(`✓ ${name}  (${size}x${size}, ${buf.length} bytes)`)
  }

  // ico 用 16/32/48 三档，覆盖大多数场景
  const icoSizes = [16, 32, 48]
  const icoPngs = []
  for (const size of icoSizes) {
    icoPngs.push({ size, data: await pngBuffer(size) })
  }
  const ico = buildIco(icoPngs)
  await fs.writeFile(path.join(OUT, 'favicon.ico'), ico)
  console.log(`✓ favicon.ico  (${icoSizes.join('/')}, ${ico.length} bytes)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
