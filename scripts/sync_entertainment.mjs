#!/usr/bin/env node
import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import { constants } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const AUTHORITATIVE_JSON = [
  path.join(ROOT, 'src/data/youtube-subs.json'),
  path.join(ROOT, 'src/data/douban/movies.json'),
  path.join(ROOT, 'src/data/douban/books.json')
]
const SIGNAL_EXIT_CODES = { SIGINT: 130, SIGTERM: 143 }

let currentChild = null
let interruptedSignal = null

for (const signal of Object.keys(SIGNAL_EXIT_CODES)) {
  process.on(signal, () => {
    if (!interruptedSignal) {
      interruptedSignal = signal
      console.error(`[!] 收到 ${signal}；中止当前同步后将恢复 authoritative JSON。`)
      currentChild?.kill(signal)
    }
  })
}

async function syncFile(filePath) {
  const handle = await fs.open(filePath, 'r+')
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
}

async function syncDirectory(directory) {
  const handle = await fs.open(directory, 'r')
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
}

async function durableCopy(source, destination, mode) {
  await fs.copyFile(source, destination, constants.COPYFILE_EXCL)
  await fs.chmod(destination, mode)
  await syncFile(destination)
  await syncDirectory(path.dirname(destination))
}

function backupPaths(backups) {
  return backups.map(({ backupPath }) => backupPath).join(', ')
}

async function cleanupBackups(backups) {
  const failures = []
  const directories = new Set()
  for (const { backupPath } of backups) {
    try {
      await fs.rm(backupPath, { force: true })
      directories.add(path.dirname(backupPath))
    } catch (error) {
      failures.push(`${backupPath}: ${error.message}`)
    }
  }
  for (const directory of directories) {
    try {
      await syncDirectory(directory)
    } catch (error) {
      failures.push(`${directory}: ${error.message}`)
    }
  }
  if (failures.length) throw new Error(`清理 durable backups 失败：${failures.join('; ')}`)
}

async function createDurableBackups(filePaths) {
  const transactionId = `${process.pid}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`
  const backups = []
  try {
    for (const filePath of filePaths) {
      const stats = await fs.lstat(filePath)
      if (!stats.isFile()) throw new Error(`authoritative JSON 不是 regular file：${filePath}`)
      const backupPath = path.join(
        path.dirname(filePath),
        `.${path.basename(filePath)}.${transactionId}.sync-backup`
      )
      const backup = { filePath, backupPath, mode: stats.mode & 0o777 }
      backups.push(backup)
      await durableCopy(filePath, backupPath, backup.mode)
    }
    return backups
  } catch (error) {
    try {
      await cleanupBackups(backups)
    } catch (cleanupError) {
      throw new Error(
        `创建 durable backups 失败：${error.message}；清理也失败：${cleanupError.message}`,
        { cause: cleanupError }
      )
    }
    throw error
  }
}

async function restoreBackups(backups) {
  const failures = []
  for (const { filePath, backupPath, mode } of backups) {
    const temporary = path.join(
      path.dirname(filePath),
      `.${path.basename(filePath)}.${process.pid}-${crypto.randomBytes(6).toString('hex')}.restore`
    )
    try {
      const backupStats = await fs.lstat(backupPath)
      if (!backupStats.isFile()) throw new Error('backup 不是 regular file')
      await durableCopy(backupPath, temporary, mode)
      await fs.rename(temporary, filePath)
      await syncDirectory(path.dirname(filePath))
    } catch (error) {
      failures.push(`${filePath} <= ${backupPath}: ${error.message}`)
    } finally {
      await fs.rm(temporary, { force: true })
    }
  }
  if (failures.length) {
    throw new Error(
      `恢复 authoritative JSON 失败：${failures.join('; ')}；durable backups 已保留：${backupPaths(backups)}`
    )
  }
}

function npmInvocation(scriptName, forwardedArgs) {
  const runArgs = ['run', scriptName, ...(forwardedArgs.length ? ['--', ...forwardedArgs] : [])]
  if (process.env.npm_execpath) {
    return {
      command: process.execPath,
      args: [process.env.npm_execpath, ...runArgs]
    }
  }
  return { command: 'npm', args: runArgs }
}

async function runNpmScript(scriptName, forwardedArgs = []) {
  if (interruptedSignal) throw new Error(`同步被 ${interruptedSignal} 中止`)
  const { command, args } = npmInvocation(scriptName, forwardedArgs)
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: ROOT, stdio: 'inherit' })
    currentChild = child
    child.once('error', (error) => {
      currentChild = null
      reject(error)
    })
    child.once('close', (code, signal) => {
      currentChild = null
      if (code === 0) resolve()
      else {
        reject(
          new Error(
            signal
              ? `npm run ${scriptName} 被 signal ${signal} 中止`
              : `npm run ${scriptName} 失败（exit ${code}）`
          )
        )
      }
    })
  })
}

async function main() {
  const rawArgs = process.argv.slice(2)
  const unknown = rawArgs.filter((arg) => arg !== '--allow-large-drop')
  if (unknown.length) {
    throw new Error(`未知选项：${unknown.join(', ')}；仅支持 --allow-large-drop`)
  }
  const syncArgs = rawArgs.includes('--allow-large-drop') ? ['--allow-large-drop'] : []

  const backups = await createDurableBackups(AUTHORITATIVE_JSON)
  if (interruptedSignal) {
    await cleanupBackups(backups)
    process.exitCode = SIGNAL_EXIT_CODES[interruptedSignal]
    return
  }

  try {
    await runNpmScript('sync:youtube', syncArgs)
    await runNpmScript('sync:douban', syncArgs)
    await runNpmScript('validate:data')
    if (interruptedSignal) throw new Error(`同步被 ${interruptedSignal} 中止`)
  } catch (error) {
    console.error(`[!] 娱乐数据同步未完整成功，正在恢复同步前的 JSON：${error.message}`)
    try {
      await restoreBackups(backups)
    } catch (restoreError) {
      console.error(`[!] ${restoreError.message}`)
      process.exitCode = interruptedSignal ? SIGNAL_EXIT_CODES[interruptedSignal] : 1
      return
    }
    try {
      await cleanupBackups(backups)
    } catch (cleanupError) {
      console.error(`[!] JSON 已完整恢复，但 ${cleanupError.message}`)
      process.exitCode = interruptedSignal ? SIGNAL_EXIT_CODES[interruptedSignal] : 1
      return
    }
    console.error('[*] 已恢复 YouTube、豆瓣电影和豆瓣图书 JSON；新下载但未引用的图片可保留。')
    process.exitCode = interruptedSignal ? SIGNAL_EXIT_CODES[interruptedSignal] : 1
    return
  }

  try {
    await cleanupBackups(backups)
  } catch (cleanupError) {
    throw new Error(
      `同步和校验已成功，但 ${cleanupError.message}；请手动检查：${backupPaths(backups)}`,
      { cause: cleanupError }
    )
  }
}

main().catch((error) => {
  console.error(`[!] ${error.message}`)
  process.exitCode = interruptedSignal ? SIGNAL_EXIT_CODES[interruptedSignal] : 1
})
