import type { NextFunction, Request, Response } from 'express'

type AppError = {
  statusCode?: number
  message?: string
  code?: string
  details?: unknown
}

export function errorHandler(
  err: AppError & { code?: string; meta?: unknown },
  _req: Request,
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

  res.status(statusCode).json({
    error: {
      message,
      code,
      details: err.details,
    },
  })
}

