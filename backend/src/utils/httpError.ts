/**
 * 统一的业务错误类。errorHandler 仍兼容历史的 `throw { statusCode, ... }` 形状，
 * 新代码用 HttpError，TypeScript 能给出补全 + IDE 跳转。
 */
export class HttpError extends Error {
  readonly statusCode: number
  readonly code?: string
  readonly details?: unknown

  constructor(statusCode: number, message: string, opts?: { code?: string; details?: unknown }) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.code = opts?.code
    this.details = opts?.details
  }

  static badRequest(message: string, opts?: { code?: string; details?: unknown }): HttpError {
    return new HttpError(400, message, opts)
  }
  static unauthorized(message: string, opts?: { code?: string; details?: unknown }): HttpError {
    return new HttpError(401, message, opts)
  }
  static forbidden(message: string, opts?: { code?: string; details?: unknown }): HttpError {
    return new HttpError(403, message, opts)
  }
  static notFound(message: string, opts?: { code?: string; details?: unknown }): HttpError {
    return new HttpError(404, message, opts)
  }
  static conflict(message: string, opts?: { code?: string; details?: unknown }): HttpError {
    return new HttpError(409, message, opts)
  }
}
