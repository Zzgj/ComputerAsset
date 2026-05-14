import type { NextFunction, Request, Response } from 'express'

import { logger } from '../utils/logger'

/** stack 截断长度：足够定位调用链，又不会让单条日志膨胀到几 KB */
const STACK_LOG_MAX = 1500

type AppError = {
  statusCode?: number
  message?: string
  code?: string
  details?: unknown
}

export function errorHandler(
  err: AppError & { code?: string; meta?: unknown; stack?: string },
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = err.statusCode ?? 500
  let message = err.message ?? 'Internal Server Error'
  let code = err.code

  const normalizedErrCode = typeof err?.code === 'string' ? err.code.trim() : String(err?.code ?? '')
  const normalizedMsg = typeof message === 'string' ? message : String(message)
  const lowerMsg = normalizedMsg.toLowerCase()

  // Multer 单文件超限
  if (normalizedErrCode === 'LIMIT_FILE_SIZE') {
    statusCode = 400
    message =
      '文件过大：已超过当前 Excel 导入大小限制。可在 backend/.env 设置 EXCEL_IMPORT_MAX_MB（MB）；设为 0 表示不限制；默认 20MB。修改后需重启后端。'
    code = 'FILE_TOO_LARGE'
  }

  // Prisma unique constraint violation (P2002) -> 返回友好业务提示
  if (normalizedErrCode === 'P2002' || normalizedMsg.includes('Unique constraint failed')) {
    statusCode = 400
    const metaTarget = (err.meta as any)?.target
    const targets = Array.isArray(metaTarget) ? metaTarget : metaTarget ? [metaTarget] : []

    const byTargetsAssetCode = targets.some((t) => String(t).includes('assetCode'))
    const byTargetsSerialNumber = targets.some((t) => String(t).includes('serialNumber'))
    const byMsgAssetCode = lowerMsg.includes('assetcode')
    const byMsgSerialNumber = lowerMsg.includes('serialnumber')

    if (byTargetsAssetCode || byMsgAssetCode) {
      message = '电脑编号（assetCode）已存在，请勿重复入库'
      code = 'DUPLICATE_ASSET_CODE'
    } else if (byTargetsSerialNumber || byMsgSerialNumber) {
      message = '序列号（serialNumber）已存在，请勿重复入库'
      code = 'DUPLICATE_SERIAL_NUMBER'
    } else {
      message = '唯一性校验失败：字段已存在'
      code = 'DUPLICATE_UNIQUE_FIELD'
    }
  }

  // 5xx 之前完全静默；现在统一上报，便于内网生产环境复盘
  if (statusCode >= 500) {
    const stack = typeof err.stack === 'string' && err.stack.length > STACK_LOG_MAX
      ? err.stack.slice(0, STACK_LOG_MAX) + '…(truncated)'
      : err.stack
    logger.error('request failed', {
      requestId: res.locals.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      code,
      message,
      stack,
    })
  }

  res.status(statusCode).json({
    error: {
      message,
      code,
      details: err.details,
    },
  })
}
