export function actionLabel(action: unknown): string {
  const a = String(action ?? '')
  const map: Record<string, string> = {
    stock_in: '入库',
    assign: '待领用',
    cancel_assign: '取消分配',
    pick_up: '领用',
    check_out: '出库/领用',
    lend: '借出',
    return: '归还',
    transfer: '调拨',
    repair: '送修',
    repair_done: '维修完成',
    retire: '报废',
  }
  return map[a] ?? a
}

