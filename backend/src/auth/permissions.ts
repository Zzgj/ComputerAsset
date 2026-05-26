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
  'employees.read',
  'employees.write',
  'employees.resign',
  'employees.transfer_campus',
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
  'employees.read': '查看员工',
  'employees.write': '编辑员工',
  'employees.resign': '办理员工离职',
  'employees.transfer_campus': '修改员工园区归属',
}

export const PERMISSION_DESCRIPTIONS: Partial<Record<PermissionKey, string>> = {
  'operations.execute': '包含出库、借用、归还、调拨、维修、报废，以及跨园区调拨消息的接收、查看和标记已读。',
  'employees.read': '查看本园区员工列表与详情。受园区范围限制。',
  'employees.write': '新建员工、编辑员工基本信息与外部资源条目（手机卡 / 邮箱 / 域控等）。受园区范围限制。',
  'employees.resign': '办理员工离职：批量标记外部资源关闭、将员工状态置为已离职。受园区范围限制。',
  'employees.transfer_campus': '修改员工所属园区。高权限操作，建议仅授予超级管理员。',
}

export function isPermissionKey(s: string): s is PermissionKey {
  return (PERMISSIONS as readonly string[]).includes(s)
}

export const ALL_PERMISSION_KEYS: PermissionKey[] = [...PERMISSIONS]
