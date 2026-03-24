function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`[env] Missing required env var: ${name}`)
  return value
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
  }
}

