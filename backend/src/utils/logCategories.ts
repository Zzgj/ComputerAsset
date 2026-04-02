import type { Prisma } from '@prisma/client'

/** 与 routes 中写入的 action 文案保持一致 */
const ASSET_REGISTER_ACTIONS = ['新增资产/入库', '编辑资产关键信息', '删除资产'] as const

const ASSET_FLOW_ACTIONS = [
  '出库（直接领用）',
  '分配（待领用）',
  '取消分配',
  '确认领用',
  '借出',
  '归还',
  '调拨',
  '送修',
  '维修完成',
  '报废',
] as const

export const LOG_CATEGORY_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'auth', label: '登录与安全' },
  { key: 'asset', label: '资产操作（全部）' },
  { key: 'asset_register', label: '资产登记与维护' },
  { key: 'asset_flow', label: '资产流转' },
  { key: 'user', label: '用户管理' },
  { key: 'department', label: '部门管理' },
  { key: 'template', label: '设备型号' },
  { key: 'system', label: '系统与备份' },
]

export function operationLogWhereForCategory(category: string | undefined): Prisma.OperationLogWhereInput | undefined {
  if (!category || category === 'all') return undefined
  switch (category) {
    case 'auth':
      return { targetType: 'auth' }
    case 'asset':
      return { targetType: 'Asset' }
    case 'asset_register':
      return { action: { in: [...ASSET_REGISTER_ACTIONS] } }
    case 'asset_flow':
      return { action: { in: [...ASSET_FLOW_ACTIONS] } }
    case 'user':
      return { targetType: 'User' }
    case 'department':
      return { targetType: 'Department' }
    case 'template':
      return { targetType: 'AssetTemplate' }
    case 'system':
      return { OR: [{ targetType: 'SystemConfig' }, { targetType: 'Backup' }] }
    default:
      return undefined
  }
}
