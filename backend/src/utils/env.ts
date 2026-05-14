function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`[env] Missing required env var: ${name}`)
  return value
}

function parseTrustProxy(raw: string | undefined): string | number | boolean {
  if (raw == null || raw === '') return 'loopback'
  const trimmed = raw.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  const n = Number(trimmed)
  if (Number.isFinite(n)) return n
  return trimmed
}

function parseNonNegativeInt(raw: string | undefined, fallback: number): number {
  if (raw == null || raw === '') return fallback
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return fallback
  return Math.trunc(n)
}

export function getEnv() {
  const PORT = Number(process.env.PORT ?? '3000')
  const DATABASE_URL = requireEnv('DATABASE_URL')
  const JWT_SECRET = requireEnv('JWT_SECRET')

  return {
    PORT: Number.isFinite(PORT) ? PORT : 3000,
    DATABASE_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '24h',
    BACKUP_DIR: process.env.BACKUP_DIR ?? 'backup',
    TRUST_PROXY: parseTrustProxy(process.env.TRUST_PROXY),
    BACKUP_RETENTION_COUNT: parseNonNegativeInt(process.env.BACKUP_RETENTION_COUNT, 30),
    SLOW_QUERY_MS: parseNonNegativeInt(process.env.SLOW_QUERY_MS, 200),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  }
}
