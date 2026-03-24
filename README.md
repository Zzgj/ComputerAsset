# ComputerAsset 电脑资产管理系统

一个前后端同仓库（Monorepo）的企业资产管理系统，覆盖电脑资产从入库到报废的完整生命周期。

- 仓库地址：<https://github.com/Zzgj/ComputerAsset>
- 技术栈：Vue 3 + Vite + Element Plus + Express + Prisma + SQLite

## 1. 项目结构

```text
.
├─ frontend/                 # 前端（Vue3 + Vite）
├─ backend/                  # 后端 API（Express + Prisma）
├─ README.md                 # 本文档（功能说明 + 运行说明）
└─ .gitignore
```

## 2. 核心功能

### 2.1 资产全流程管理
- 入库（支持模板自动填充）
- 出库（直接领用）
- 分配待领用 / 取消分配 / 确认领用
- 借出 / 归还
- 调拨
- 送修 / 维修完成
- 报废

### 2.2 可视化与审计
- 仪表盘：总量、状态分布、部门分布、提醒通知
- 出入库记录与操作日志
- 资产详情时间线（含历史流转）

### 2.3 系统管理
- 用户管理（super_admin / admin / viewer）
- 部门管理
- 设备模板管理
- 系统配置（如一人一机、提醒天数）
- Excel 导入导出、数据库备份下载

## 3. 主要状态流转

```text
在库 -> 待领用 -> 使用中 -> 归还 -> 在库
在库 -> 借用中 -> 归还 -> 在库
任意 -> 维修中 -> 在库/已报废
任意 -> 已报废
```

## 4. 权限模型

- `super_admin`：系统全部权限（含用户管理、系统配置、备份）
- `admin`：资产业务管理（入库、出库、借还、调拨、维修等）
- `viewer`：只读查看

## 5. 运行环境

- Node.js（建议 LTS，v20+）
- pnpm（推荐）

## 6. 本地开发启动

### 6.1 启动后端

```bash
cd backend
# Windows 可手动复制 .env.example 为 .env
pnpm install
pnpm exec prisma migrate deploy
pnpm run dev
```

默认后端地址：`http://127.0.0.1:3000`

### 6.2 启动前端

```bash
cd frontend
pnpm install
pnpm run dev
```

默认前端地址：`http://localhost:5173`

开发模式下前端 `/api` 会代理到后端（默认 `http://127.0.0.1:3000`）。

如果后端端口不同，可在 `frontend/.env.development` 中设置：

```env
VITE_API_PROXY_TARGET=http://127.0.0.1:你的端口
```

## 7. 默认账号（开发环境）

- 用户名：`admin`
- 密码：`admin123`
- 角色：`super_admin`

> 仅用于开发/测试，生产环境请立即修改。

## 8. 关键接口分组

- 认证：`/api/auth`
- 资产：`/api/assets`
- 业务操作：`/api/operations`
- 仪表盘：`/api/dashboard`
- 日志：`/api/logs`
- 模板：`/api/templates`
- 部门：`/api/departments`
- 用户：`/api/users`
- 系统配置：`/api/config`
- 导入导出：`/api/excel`
- 备份：`/api/backup`

## 9. 首次推送 GitHub（新环境）

```bash
git init
git add .
git commit --trailer "Made-with: Cursor" -m "chore: initial import ComputerAsset"
git branch -M main
git remote add origin https://github.com/Zzgj/ComputerAsset.git
git push -u origin main
```

## 10. 仓库精简策略（已执行）

以下内容属于构建/生成产物，不应提交：

- `node_modules/`
- `dist/`
- `.env`
- `backend/data/*.db`
- `backend/.prisma/`
- `backend/prisma/.prisma/`

克隆仓库后请本地重新安装依赖并执行数据库迁移。
