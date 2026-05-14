import type { NextFunction, Request, Response } from 'express'
import { randomUUID } from 'crypto'

/**
 * 给每个请求挂一个 requestId，写入 res.locals 供 logger / errorHandler 关联。
 * 优先复用上游 X-Request-Id 头（反代/网关已生成时不重复），并把 id 写回响应头。
 */
export function requestId(req: Request, res: Response, next: NextFunction) {
  const upstream = req.headers['x-request-id']
  const candidate = Array.isArray(upstream) ? upstream[0] : upstream
  const id = typeof candidate === 'string' && candidate.trim() !== '' ? candidate.trim() : randomUUID()
  res.locals.requestId = id
  res.setHeader('X-Request-Id', id)
  next()
}
