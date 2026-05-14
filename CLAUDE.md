# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

ComputerAsset 是企业电脑资产管理系统，覆盖入库、出库/领用、借用归还、调拨、维修、报废全生命周期。Monorepo 结构：`frontend/`（Vue 3 + Vite）+ `backend/`（Express 5 + Prisma 7 + SQLite），两端独立 `package.json` 与 `pnpm-lock.yaml`。生产部署中后端直接托管 `frontend/dist` 的静态资源，无需 Nginx。

## 常用命令

包管理器统一使用 **pnpm**（部署包内才会用 npm 装后端生产依赖）。

### 一键启动（开发）

```bash
./start.sh           # macOS/Linux
start.bat            # Windows
```

会依次检查 Node/pnpm/端口、补全 `backend/.env`、跑 `prisma migrate deploy` 再同时拉起后端 (3000) 与前端 Vite (5173)。`Ctrl+C` 一并停止。

### 后端（`cd backend`）

```bash
pnpm install
cp .env.example .env                       # 首次运行
pnpm exec prisma migrate deploy            # 生产/部署用
pnpm exec prisma migrate dev --name xxx    # 新增迁移
pnpm run dev                               # tsx watch src/server.ts
pnpm run build                             # tsc -p tsconfig.build.json → dist/
pnpm start                                 # 触发 prestart=build，然后 node dist/server.js
```

### 前端（`cd frontend`）

```bash
pnpm install
pnpm run dev          # vite，5173；/api 通过 http-proxy-middleware 转发到 3000
pnpm run build        # 并行 type-check + vite build → dist/
pnpm run lint         # oxlint --fix && eslint --fix --cache
pnpm run format       # prettier
pnpm run type-check   # vue-tsc --build
```

无单元测试框架；UI 改动需手动在浏览器中走通流程后再交付。

### Windows 离线部署包

```bash
deploy/prepare.bat      # 或 bash deploy/prepare.sh
```

会构建前后端、把 `backend/dist`、`frontend/dist`、Prisma 迁移 + `deploy/package-scripts/` 下的 `deploy.bat`/`stop.bat`/`restart.bat` 组装到 `deploy-package/`，目标机器只需 Node 20+。

## 架构要点

### 后端入口与中间件链

- `backend/src/server.ts` 调用 `ensureSeed()` 后启动 Express。`ensureSeed` 不仅做首启数据，还做**幂等数据修复**：拆分历史「父（子）」式部门名称、修复曾经的 `in_user` 拼写错误、补建每个园区下的「未分配」部门。新增类似启动期数据迁移时放进 `bootstrap/seed.ts`。
- `backend/src/app.ts` 中 `/api/excel/template` **必须**挂在 app 上而不是子 Router，否则部分 Express 5 嵌套路由组合下 GET 返回 404。改路由时勿移动这一行。
- 静态托管目录通过 `STATIC_DIR` 环境变量覆盖，默认 `../../frontend/dist`；存在时启用 SPA fallback `app.get('/{*path}', …)`。
- Prisma 走 `@prisma/adapter-libsql`（不是默认驱动）。`backend/prisma.config.ts` 用 `prisma/config` 的 `env(...)` 读取 `DATABASE_URL`，迁移命令需要 `.env` 已配置。

### 权限模型（这是项目的核心抽象）

不要按"super_admin/admin/viewer"硬编码。系统是**权限键 + 园区范围**的 RBAC：

- 权限键白名单见 `backend/src/auth/permissions.ts` 的 `PERMISSIONS` 数组（`assets.read`、`operations.execute`、`excel.import` 等）。新增权限要同步：常量、`PERMISSION_LABELS`、需要时 `PERMISSION_DESCRIPTIONS`，以及前端 `router/index.ts` 路由 meta。
- `AccessRole.bypassAll = true` 表示超级管理员，跳过权限与园区双重校验；普通角色通过 `AccessRolePermission` 多对多挂权限键，通过 `AccessRoleCampus` 限制园区可见范围。
- JWT 载荷把权限和园区裁剪后塞进 `bu/p/ca/ci` 字段（见 `auth/jwtAccess.ts`），中间件 `requireAuth` 解出后挂在 `req.access`，业务用 `requirePermission` / `requireAnyPermission` 校验。
- 园区范围**不是过滤参数而是查询前缀**：所有按园区受限的 list 查询都要调用 `applyCampusScopeToAssetWhere(where, auth)` 或 `applyCampusScopeToRecordWhere`，对单条资源用 `assertCampusAccess(auth, campusId)`。绕过这层会泄露跨园区数据。
- 单设备登录：登录时把新 `sessionToken` 写入 `User.sessionToken`，旧 token 在 `requireAuth` 里被检测到不匹配会返回 `code: SESSION_REPLACED`，前端 `services/api.ts` 看到 401 + 该 code 自动跳登录页并提示。

### 资产状态与乐观锁

- `AssetStatus`: `in_stock` → `waiting_pickup` / `pending_confirmation`（待签字）→ `in_use` / `borrowed`，外加 `in_repair` / `retired`。详见 README「资产状态流转」。
- `Asset.version` 是乐观锁字段。`backend/src/routes/operations.ts` 的所有流转用 `updateAssetWithVersion` 包装：`updateMany` 同时匹配 `id + version + 期望状态`，`count !== 1` 抛 `ASSET_VERSION_CONFLICT`。新增流转操作（出库/借用/归还/调拨/维修/报废）务必沿用此模式，不要直接 `update`。
- 跨园区调拨触发 `AssetTransferNotification`：源园区操作员调拨到外园区时，给目标园区拥有 `operations.execute` 的用户群发提醒，前端登录后轮询未读数。

### 前端约定

- API 都走 `frontend/src/services/api.ts` 的 `apiRequest`：自动注入 `Authorization`，401 时清 token 并跳 `/login`，`SESSION_REPLACED` 时带提示文案。直接 `fetch` 写新调用会绕过这套行为。
- 路由级权限守卫在 `router/index.ts` 的 `beforeEach`：用 `meta.permissions` 数组（OR 语义），`bypassAll` 直接放行。新增受限页面只需在 meta 里挂上权限键。
- Auth store 在 `stores/auth.ts`，`me.permissions/bypassAll` 决定 UI 展示；`can(key)` 是组件里判断按钮可见性的入口。
- Vite 开发代理由 `vite.config.ts` 中的 `apiProxyPlugin` 用 `http-proxy-middleware` 实现，**不要**改回内置 `server.proxy`（已踩坑：`/api` 前缀会被 Connect 剥掉导致后端 404）。
- 生产构建会注入 `VITE_PUBLIC_BASE_URL`（来自 `frontend/env.deployment`，由 `deploy/prepare` 复制为 `.env.production.local`）。签字二维码默认跟随浏览器访问地址，仅在配置了该变量时使用固定地址。

### Excel 导入

`backend/src/routes/excel.ts` 是体量最大的文件。导入必须先走预校验返回统计 + 无效行明细，再正式导入；模板匹配规则、序列号占位符（`暂无-电脑编号`）、状态/人员联动校验在 README「Excel 导入规则」节。文件大小上限通过 `EXCEL_IMPORT_MAX_MB` 环境变量控制（0 = 不限），超限被 multer 拦截后由 `errorHandler` 统一翻译为 `FILE_TOO_LARGE`。

### 错误处理

`middleware/errorHandler.ts` 把 Prisma `P2002`（唯一约束）翻译成业务错误码（`DUPLICATE_ASSET_CODE` / `DUPLICATE_SERIAL_NUMBER`）。业务代码抛错请用 `throw { statusCode, code, message, details }` 形状，便于上层透传到前端。

## 开发注意

- 后端是 CommonJS (`"type": "commonjs"`)，前端是 ESM (`"type": "module"`)，注意混用 import 写法。
- 生产构建关闭了 vue-devtools（避免内网离线环境拉取外链超时），改 `vite.config.ts` 时保留 `isProd` 分支。
- JSON 请求体限制 2MB；Excel 走 multipart/form-data 不受影响。
- 数据库文件默认在 `backend/data/dev.db`，备份目录 `backend/backup/`（由 `BACKUP_DIR` 控制）。这两个目录都不入库。
- 提交信息遵循 Conventional Commits（`feat:` / `fix:` / `refactor:` 等），可参考 `git log`。
