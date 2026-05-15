/**
 * Express Request / Response 增强：把 requireAuth 注入的 access/auth 与
 * requestId middleware 注入的 res.locals.requestId 提升为类型安全字段，
 * 消除 routes 里随处可见的 `(req as any).access`。
 */
import type { AccessAuth } from '../auth/accessContext'

declare global {
  namespace Express {
    interface Request {
      /** requireAuth middleware 注入；未走 requireAuth 的端点为 undefined */
      access?: AccessAuth
      /** requireAuth middleware 注入；未走 requireAuth 的端点为 undefined */
      auth?: { id: number }
    }
    interface Locals {
      /** requestId middleware 注入，所有端点都有 */
      requestId: string
    }
  }
}

export {}
