#!/usr/bin/env node
import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const CONFIG_DIR =
  process.env.YOUTUBE_SYNC_CONFIG_DIR ||
  path.join(os.homedir(), 'Library', 'Application Support', 'ayaya-blog')
const CLIENT_PATH = process.env.YOUTUBE_OAUTH_CLIENT || path.join(CONFIG_DIR, 'youtube-client.json')
const TOKEN_PATH = process.env.YOUTUBE_OAUTH_TOKEN || path.join(CONFIG_DIR, 'youtube-token.json')
const OUT_JSON = path.join(ROOT, 'src/data/youtube-subs.json')
const AVATAR_DIR = path.join(ROOT, 'public/youtube-avatars')
const AVATAR_PUBLIC_PREFIX = '/youtube-avatars'
const OAUTH_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly'

const args = new Set(process.argv.slice(2))
const AUTH_ONLY = args.has('--auth-only')
const REAUTHORIZE = args.has('--reauthorize')
const REFRESH_AVATARS = args.has('--refresh-avatars')

function printHelp() {
  console.log(`Usage: npm run sync:youtube -- [options]

Options:
  --auth-only        Complete OAuth authorization without syncing data
  --reauthorize      Ignore the saved token and authorize again
  --refresh-avatars  Re-download existing channel avatars
  --help             Show this help

OAuth client: ${CLIENT_PATH}
OAuth token:  ${TOKEN_PATH}`)
}

function base64Url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function readJsonIfPresent(filePath) {
  try {
    return await readJson(filePath)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function writePrivateJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 })
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600
  })
  await fs.chmod(filePath, 0o600)
}

function normalizeClient(payload) {
  const client = payload.installed || payload.web || payload
  if (!client?.client_id || !client?.client_secret) {
    throw new Error(`OAuth client JSON 缺少 client_id 或 client_secret: ${CLIENT_PATH}`)
  }
  return {
    client_id: client.client_id,
    client_secret: client.client_secret
  }
}

async function loadClient() {
  try {
    return normalizeClient(await readJson(CLIENT_PATH))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    throw new Error(
      [
        `找不到 YouTube OAuth client: ${CLIENT_PATH}`,
        '请在 Google Cloud 创建 Desktop OAuth client，并把下载的 JSON 放到上面的路径。',
        '只需启用 YouTube Data API v3；OAuth scope 由本脚本固定为 youtube.readonly。'
      ].join('\n'),
      { cause: error }
    )
  }
}

function openBrowser(url) {
  console.log(`[*] 如果浏览器没有自动打开，请访问：\n${url}`)
  const child = spawn('open', [url], { detached: true, stdio: 'ignore' })
  child.on('error', () => {
    console.log(`请在浏览器打开以下地址完成授权：\n${url}`)
  })
  child.unref()
}

async function exchangeToken(params) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params)
  })
  const payload = await response.json()
  if (!response.ok) {
    const detail = payload.error_description || payload.error || `HTTP ${response.status}`
    throw new Error(`OAuth token 请求失败: ${detail}`)
  }
  return payload
}

async function authorize(client) {
  const verifier = base64Url(crypto.randomBytes(48))
  const challenge = base64Url(crypto.createHash('sha256').update(verifier).digest())
  const state = base64Url(crypto.randomBytes(24))

  let callbackResolve
  let callbackReject
  const callback = new Promise((resolve, reject) => {
    callbackResolve = resolve
    callbackReject = reject
  })

  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1')
    if (url.pathname !== '/oauth2callback') {
      response.writeHead(404).end('Not found')
      return
    }

    const error = url.searchParams.get('error')
    const code = url.searchParams.get('code')
    const returnedState = url.searchParams.get('state')

    if (error) {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end(`YouTube 授权失败：${error}`)
      callbackReject(new Error(`用户授权失败: ${error}`))
      return
    }
    if (!code || returnedState !== state) {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('授权回调无效，可以关闭此页面。')
      callbackReject(new Error('OAuth 回调缺少 code 或 state 不匹配'))
      return
    }

    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(
      '<!doctype html><meta charset="utf-8"><title>YouTube 已授权</title>' +
        '<style>body{font:16px system-ui;max-width:42rem;margin:15vh auto;padding:2rem;line-height:1.6}</style>' +
        '<h1>授权完成</h1><p>Codex 正在同步 YouTube 数据，现在可以关闭此页面。</p>'
    )
    callbackResolve(code)
  })

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  const { port } = server.address()
  const redirectUri = `http://127.0.0.1:${port}/oauth2callback`
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.search = new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: OAUTH_SCOPE,
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state
  })

  console.log('[*] 正在浏览器中请求 YouTube read-only 授权…')
  openBrowser(authUrl.toString())

  const timeout = setTimeout(
    () => {
      callbackReject(new Error('等待 OAuth 授权超时，请重新运行同步命令'))
    },
    5 * 60 * 1000
  )

  try {
    const code = await callback
    const tokenParams = {
      client_id: client.client_id,
      code,
      code_verifier: verifier,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }
    tokenParams.client_secret = client.client_secret
    const token = await exchangeToken(tokenParams)
    const saved = {
      refresh_token: token.refresh_token,
      access_token: token.access_token,
      token_type: token.token_type,
      scope: token.scope,
      expires_at: Date.now() + token.expires_in * 1000
    }
    if (!saved.refresh_token) {
      throw new Error('Google 未返回 refresh token，请使用 --reauthorize 再试一次')
    }
    await writePrivateJson(TOKEN_PATH, saved)
    return saved
  } finally {
    clearTimeout(timeout)
    server.close()
  }
}

async function refreshAccessToken(client, savedToken) {
  const tokenParams = {
    client_id: client.client_id,
    refresh_token: savedToken.refresh_token,
    grant_type: 'refresh_token'
  }
  tokenParams.client_secret = client.client_secret
  const token = await exchangeToken(tokenParams)
  const refreshed = {
    ...savedToken,
    ...token,
    refresh_token: savedToken.refresh_token,
    expires_at: Date.now() + token.expires_in * 1000
  }
  await writePrivateJson(TOKEN_PATH, refreshed)
  return refreshed
}

async function getToken(client) {
  const saved = REAUTHORIZE ? null : await readJsonIfPresent(TOKEN_PATH)
  if (!saved?.refresh_token) return await authorize(client)

  try {
    return await refreshAccessToken(client, saved)
  } catch (error) {
    if (error.message.includes('invalid_grant')) {
      throw new Error(
        `YouTube OAuth token 已失效，请运行 npm run sync:youtube -- --reauthorize\n${error.message}`,
        { cause: error }
      )
    }
    throw error
  }
}

async function youtubeGet(endpoint, params, accessToken) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`)
  url.search = new URLSearchParams(params)
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const payload = await response.json()
  if (!response.ok) {
    const detail = payload.error?.message || `HTTP ${response.status}`
    throw new Error(`YouTube API ${endpoint} 请求失败: ${detail}`)
  }
  return payload
}

async function getAuthenticatedChannels(accessToken) {
  const payload = await youtubeGet(
    'channels',
    { part: 'id,snippet', mine: 'true', maxResults: '50' },
    accessToken
  )
  return payload.items || []
}

async function getSubscriptions(accessToken) {
  const items = []
  let pageToken

  do {
    const params = {
      part: 'snippet',
      mine: 'true',
      maxResults: '50',
      order: 'alphabetical'
    }
    if (pageToken) params.pageToken = pageToken
    const payload = await youtubeGet('subscriptions', params, accessToken)
    items.push(...(payload.items || []))
    pageToken = payload.nextPageToken
  } while (pageToken)

  return items
}

function bestThumbnail(thumbnails = {}) {
  return thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || null
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function downloadAvatar(channelId, avatarUrl) {
  const destination = path.join(AVATAR_DIR, `${channelId}.jpg`)
  const publicPath = `${AVATAR_PUBLIC_PREFIX}/${channelId}.jpg`
  if (!REFRESH_AVATARS && (await fileExists(destination))) return publicPath
  if (!avatarUrl) return (await fileExists(destination)) ? publicPath : null

  try {
    const response = await fetch(avatarUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      throw new Error(`unexpected content-type: ${contentType || 'unknown'}`)
    }
    const temporary = `${destination}.tmp`
    await fs.writeFile(temporary, Buffer.from(await response.arrayBuffer()))
    await fs.rename(temporary, destination)
    return publicPath
  } catch (error) {
    console.warn(`  ! 头像下载失败 ${channelId}: ${error.message}`)
    return (await fileExists(destination)) ? publicPath : null
  }
}

async function mapLimit(values, limit, mapper) {
  const result = new Array(values.length)
  let cursor = 0

  async function worker() {
    while (cursor < values.length) {
      const index = cursor++
      result[index] = await mapper(values[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker))
  return result
}

async function syncSubscriptions(accessToken) {
  console.log('[*] 读取已授权账号的 YouTube 订阅…')
  const subscriptions = await getSubscriptions(accessToken)
  await fs.mkdir(AVATAR_DIR, { recursive: true })

  const items = await mapLimit(subscriptions, 4, async (subscription, index) => {
    const snippet = subscription.snippet || {}
    const id = snippet.resourceId?.channelId
    if (!id) throw new Error('YouTube subscription 缺少 channelId')
    process.stdout.write(`  [${index + 1}/${subscriptions.length}] ${snippet.title || id}\n`)
    return {
      id,
      url: `https://www.youtube.com/channel/${id}`,
      title: snippet.title || id,
      avatar: await downloadAvatar(id, bestThumbnail(snippet.thumbnails))
    }
  })

  const channelIds = new Set()
  for (const item of items) {
    if (channelIds.has(item.id)) {
      throw new Error(`YouTube API 返回重复 channelId：${item.id}；为避免覆盖旧数据，本次停止`)
    }
    channelIds.add(item.id)
  }

  const previous = await readJsonIfPresent(OUT_JSON)
  if (items.length === 0 && Array.isArray(previous?.items) && previous.items.length > 0) {
    throw new Error('YouTube API 意外返回空订阅列表；为避免覆盖旧数据，本次停止')
  }

  items.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'))
  const now = new Date()
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  const payload = {
    count: items.length,
    updated_at: localTime.toISOString().replace('T', ' ').slice(0, 19),
    items
  }
  const temporary = `${OUT_JSON}.tmp`
  await fs.writeFile(temporary, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  await fs.rename(temporary, OUT_JSON)
  console.log(`[*] 写入 ${OUT_JSON}（${items.length} 条）`)
}

async function main() {
  if (args.has('--help')) {
    printHelp()
    return
  }

  const client = await loadClient()
  const token = await getToken(client)
  const channels = await getAuthenticatedChannels(token.access_token)
  if (channels.length === 0) {
    throw new Error('当前 Google 账号没有可访问的 YouTube channel')
  }
  console.log(
    `[*] 已授权频道: ${channels.map((item) => item.snippet?.title || item.id).join(', ')}`
  )

  if (!AUTH_ONLY) await syncSubscriptions(token.access_token)
}

main().catch((error) => {
  console.error(`[!] ${error.message}`)
  process.exitCode = 1
})
