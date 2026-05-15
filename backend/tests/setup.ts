// vitest setup：为单测提供必需的 env 变量。这些变量在生产由 .env 提供，
// 但纯函数测试无需真正连 DB / 签 JWT，给个占位让 getEnv() 不抛错即可。
process.env.DATABASE_URL ??= 'file:./tests/_dummy.db'
process.env.JWT_SECRET ??= 'test-secret-not-used'
