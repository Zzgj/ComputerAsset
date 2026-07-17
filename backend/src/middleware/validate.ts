/**
 * zod schema 校验中间件。把 req.body / req.query / req.params 替换为
 * schema.parse 的结果，让后续 handler 直接用强类型。
 *
 * 用法：
 *   const LoginSchema = z.object({ username: z.string(), password: z.string() })
 *   router.post('/login', validate({ body: LoginSchema }), (req, res) => {
 *     const { username, password } = req.body  // 已是 string
 *   })
 */
import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

type Schemas = {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body)
      if (schemas.query) Object.assign(req.query, schemas.query.parse(req.query))
      if (schemas.params) Object.assign(req.params, schemas.params.parse(req.params))
      next()
    } catch (e) {
      next(e)
    }
  }
}
