/**
 * 轻量结构化日志：dev 直接 console，prod 输出单行 JSON。
 * 不引入 pino 等依赖，避免占用部署包体积；接口对齐 pino 的常用方法，便于将来无痛切换。
 */
import { getEnv } from './env'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const cachedEnv = getEnv()
const cachedIsProd = cachedEnv.NODE_ENV === 'production'
const cachedMinLevel = ((): number => {
  const raw = (process.env.LOG_LEVEL ?? '').toLowerCase()
  if (raw && raw in LEVEL_ORDER) return LEVEL_ORDER[raw as LogLevel]
  return cachedIsProd ? LEVEL_ORDER.info : LEVEL_ORDER.debug
})()

type LogContext = Record<string, unknown> | undefined

function consoleFor(level: LogLevel): (...args: unknown[]) => void {
  // eslint-disable-next-line no-console
  if (level === 'error') return console.error
  // eslint-disable-next-line no-console
  if (level === 'warn') return console.warn
  // eslint-disable-next-line no-console
  return console.log
}

function emit(level: LogLevel, msg: string, ctx: LogContext) {
  if (LEVEL_ORDER[level] < cachedMinLevel) return

  const out = consoleFor(level)
  if (cachedIsProd) {
    out(JSON.stringify({ ts: new Date().toISOString(), level, msg, ...(ctx ?? {}) }))
    return
  }

  if (ctx && Object.keys(ctx).length > 0) {
    out(`[${level}]`, msg, ctx)
  } else {
    out(`[${level}]`, msg)
  }
}

export const logger = {
  debug(msg: string, ctx?: LogContext) {
    emit('debug', msg, ctx)
  },
  info(msg: string, ctx?: LogContext) {
    emit('info', msg, ctx)
  },
  warn(msg: string, ctx?: LogContext) {
    emit('warn', msg, ctx)
  },
  error(msg: string, ctx?: LogContext) {
    emit('error', msg, ctx)
  },
}

/** 把任意抛错值收敛成 `{ message, stack? }`，统一日志/响应中错误形状。 */
export function formatError(e: unknown): { message: string; stack?: string } {
  if (e instanceof Error) return { message: e.message, stack: e.stack }
  return { message: String(e) }
}
