/** 权限键：与 AccessRolePermission.key 一致 */
export const PERMISSIONS = [
  'dashboard.view',
  'assets.read',
  'assets.write',
  'assets.delete',
  'records.read',
  'operations.execute',
  'templates.manage',
  'departments.manage',
  'campuses.manage',
  'excel.import',
  'excel.export',
  'backup.run',
  'users.manage',
  'roles.manage',
  'config.manage',
  'logs.read',
] as const

export type PermissionKey = (typeof PERMISSIONS)[number]

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  'dashboard.view': '查看仪表盘',
  'assets.read': '查看资产',
  'assets.write': '登记/编辑资产',
  'assets.delete': '删除资产',
  'records.read': '查看出入库记录',
  'operations.execute': '出入库与流转操作',
  'templates.manage': '设备型号管理',
  'departments.manage': '部门管理',
  'campuses.manage': '园区管理',
  'excel.import': 'Excel 导入',
  'excel.export': 'Excel 导出',
  'backup.run': '数据备份/恢复',
  'users.manage': '用户管理',
  'roles.manage': '角色与权限配置',
  'config.manage': '系统配置',
  'logs.read': '操作日志',
}

export function isPermissionKey(s: string): s is PermissionKey {
  return (PERMISSIONS as readonly string[]).includes(s)
}

export const ALL_PERMISSION_KEYS: PermissionKey[] = [...PERMISSIONS]
