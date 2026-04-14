<div align="center">

# ComputerAsset - Server Deploy Edition

### 企业电脑资产管理系统 · 服务器部署版

本分支为 **Windows Server 内网离线部署专用版本**，包含完整的部署脚本和工具链。

功能代码与 [`main`](https://github.com/Zzgj/ComputerAsset/tree/main) 分支保持同步。

[![Version](https://img.shields.io/badge/version-1.4.2-blue.svg)](https://github.com/Zzgj/ComputerAsset)
[![Branch](https://img.shields.io/badge/branch-deploy%2Fwindows--server-orange.svg)](https://github.com/Zzgj/ComputerAsset/tree/deploy/windows-server)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen.svg)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D.svg?logo=vue.js)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000.svg?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748.svg?logo=prisma)](https://www.prisma.io/)

</div>

---

## 分支说明

| 分支 | 用途 | 说明 |
|------|------|------|
| [`main`](https://github.com/Zzgj/ComputerAsset/tree/main) | 开发主分支 | 源代码、开发文档、开发环境启动脚本 |
| **`deploy/windows-server`** (当前) | 服务器部署分支 | 在 main 基础上增加部署脚本、生产模式静态文件托管 |

**本分支额外包含：**
- `deploy/prepare.bat` / `prepare.sh` — 部署包构建脚本（在有网络的机器上运行）
- `deploy/deploy.bat` — 服务器一键部署脚本（在内网服务器上运行）
- `deploy/stop.bat` — 服务停止脚本
- `deploy/README.txt` — 纯文本部署指南（可随部署包一起拷贝）
- `backend/src/app.ts` — 增加前端静态文件托管，生产模式下前后端合一运行

---

> **完整功能说明、技术栈、API 与更新日志**：本 README 已合并 `main` 分支文档；也可直接查看 [`main` 分支 README](https://github.com/Zzgj/ComputerAsset/tree/main)。

## 目标部署环境

- **操作系统** — Windows Server 2019 Standard 或更高版本
- **运行时** — Node.js >= 20（推荐 v22.x），服务器上唯一需要安装的软件
- **网络** — 目标服务器无需外网，仅需内网访问
- **不需要** — pnpm、npm、Git、Python 或任何其他开发工具

---

## 部署流程

整个部署分为两步：**构建**（有网络的机器）和**部署**（内网服务器）。

### 第一步：构建部署包（需要网络）

在一台**可以访问互联网**的 Windows 电脑上操作（也支持 macOS/Linux）：

**1. 克隆仓库并切换到本分支**

```bash
git clone https://github.com/Zzgj/ComputerAsset.git
cd ComputerAsset
git checkout deploy/windows-server
```

**2. 运行构建脚本**

Windows：
```cmd
deploy\prepare.bat
```

macOS / Linux：
```bash
bash deploy/prepare.sh
```

构建脚本会自动完成以下工作：

| 步骤 | 内容 |
|------|------|
| 检查环境 | 验证 Node.js 和 pnpm |
| 安装后端依赖 | `pnpm install` + 原生模块构建 |
| 生成 Prisma 客户端 | 数据库类型定义和引擎 |
| 构建后端 | TypeScript 编译为 JavaScript |
| 安装前端依赖并构建 | Vue 3 打包为静态文件 |
| 组装部署包 | 使用 npm 生成标准 node_modules，复制所有运行时文件 |
| 前端生产环境变量 | 若存在 `frontend/env.deployment`，构建前会复制为 `frontend/.env.production.local` 再打包（见下节） |

完成后生成 `deploy-package/` 文件夹，这就是完整的部署包。

#### 签名链接与二维码：`VITE_PUBLIC_BASE_URL`（请务必按需修改）

出库、借出后的**签名二维码**和**复制签名链接**中的地址，必须指向用户（手机或其他电脑）能打开的站点根 URL，而不能是构建机或浏览器里的 `localhost`。

1. **配置文件路径**：仓库内 **`frontend/env.deployment`**（仅本部署分支维护；不入 `.gitignore`，可提交团队统一默认值）。
2. **变量名**：`VITE_PUBLIC_BASE_URL`，例如 `http://10.2.254.29:3000`（**不要**末尾多余 `/`；若使用 HTTPS 或域名，改为 `https://asset.example.com` 等形式即可）。
3. **何时必须改**：
   - 服务器 IP、**端口**（与 `backend\.env` 里 `PORT` 一致）、或对外使用**域名**与仓库默认值不一致时；
   - 修改后必须在**有网络的构建机**上重新运行 **`deploy\prepare.bat`** 或 **`deploy/prepare.sh`**，再拷贝新的 `deploy-package` 到服务器并执行 `deploy.bat`，否则前端包里仍是旧地址。
4. **机制说明**：`prepare` 在「安装前端依赖并构建」前会把 `frontend/env.deployment` 复制为 `frontend/.env.production.local`，Vite 构建时将其注入前端；未改该文件时沿用仓库中的默认示例值。

**3. 拷贝到内网服务器**

将 `deploy-package/` 文件夹整体拷贝到内网服务器（U盘、文件共享、FTP 等方式均可）。

放置到目标路径，例如：`D:\ComputerAsset\`

### 第二步：在服务器上部署（无需网络）

**1. 双击运行 `deploy.bat`**

部署脚本会自动完成以下 4 个阶段：

| 阶段 | 检查项 |
|------|--------|
| Environment Check | Node.js 版本验证（>= v20）、部署文件完整性检查 |
| Configuration | 自动创建 `.env` 配置文件、初始化数据目录 |
| Database | 使用 Prisma 执行数据库迁移（直接调用 node_modules 内的 CLI，无需 pnpm） |
| Start Service | 端口冲突检测与自动终止、健康检查等待、输出访问地址 |

**2. 访问系统**

部署成功后：
- 本机访问：`http://127.0.0.1:3000`
- 局域网访问：`http://服务器IP:3000`

---

## 默认账号

| 字段 | 值 |
|------|------|
| 用户名 | `admin` |
| 密码 | `admin123` |
| 角色 | 超级管理员 |

> **首次登录后请立即修改默认密码！**

---

## 配置说明

配置文件位于 `backend\.env`（首次部署时自动从 `.env.example` 创建）：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 服务端口号 |
| `DATABASE_URL` | `file:./data/dev.db` | SQLite 数据库文件路径 |
| `JWT_SECRET` | `replace_with_...` | JWT 签名密钥（**生产环境务必修改为随机长字符串**） |
| `JWT_EXPIRES_IN` | `24h` | 登录令牌有效期 |
| `BACKUP_DIR` | `backup` | 数据库备份目录 |

修改配置后需重启服务生效。

---

## 日常运维

| 操作 | 方法 |
|------|------|
| 启动服务 | 双击 `deploy.bat` |
| 停止服务 | 双击 `stop.bat`，或关闭服务命令行窗口 |
| 查看日志 | 直接查看服务命令行窗口输出 |
| 数据备份 | 在系统内使用「数据备份」功能，或直接复制 `backend\data\dev.db` 文件 |
| 数据恢复 | 停止服务 → 替换 `backend\data\dev.db` → 重新启动 |
| 版本更新 | 在有网络的机器上拉取最新代码重新运行 `prepare.bat`，将新的 `deploy-package` 覆盖到服务器，再运行 `deploy.bat` |

---

## 防火墙设置

如果需要局域网内其他电脑访问系统，需在 Windows 防火墙中放行端口：

**方法一：图形界面**

1. 打开「Windows Defender 防火墙」→「高级设置」
2. 入站规则 → 新建规则
3. 选择「端口」→ TCP → 特定本地端口：`3000`
4. 允许连接 → 选择适用的网络配置文件
5. 命名为 `ComputerAsset`

**方法二：命令行（以管理员身份运行）**

```cmd
netsh advfirewall firewall add rule name="ComputerAsset" dir=in action=allow protocol=tcp localport=3000
```

---

## 部署包目录结构

```text
deploy-package/
├── backend/
│   ├── dist/                # 后端编译产物（JavaScript）
│   ├── node_modules/        # 运行时依赖（标准 npm 扁平结构）
│   ├── prisma/
│   │   ├── schema.prisma    # 数据库模型
│   │   └── migrations/      # 迁移文件
│   ├── prisma.config.ts     # Prisma 配置
│   ├── package.json
│   └── .env.example         # 环境变量模板
│
├── frontend/
│   └── dist/                # 前端静态文件（HTML/CSS/JS）
│
├── deploy.bat               # 一键部署脚本
├── stop.bat                 # 停止服务脚本
└── README.txt               # 纯文本部署指南
```

---

## 常见问题

**Q：启动时提示端口被占用**

`deploy.bat` 会自动检测并提示是否终止占用进程。也可以修改 `backend\.env` 中的 `PORT` 为其他端口号。

**Q：访问时页面空白**

确认 `frontend\dist\` 文件夹存在且包含 `index.html`。本分支的后端在生产模式下会自动托管前端静态文件。

**Q：登录失败**

首次部署需等待数据库迁移完成。检查 `backend\.env` 中 `JWT_SECRET` 是否已配置。

**Q：需要更新版本**

在有网络的机器上拉取最新代码：
```bash
git pull origin deploy/windows-server
```
重新运行 `prepare.bat` 构建，将新的 `deploy-package` 覆盖到服务器，再运行 `deploy.bat`。

**Q：如何查看功能说明和完整文档？**

请查看 [`main` 分支的 README](https://github.com/Zzgj/ComputerAsset/tree/main)，包含完整的功能特性、技术栈、权限模型、API 接口、更新日志等文档。

---

## 许可证

本项目基于 [ISC 许可证](https://opensource.org/licenses/ISC) 开源发布。
## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境变量配置](#环境变量配置)
- [生产环境部署](#生产环境部署)
- [资产状态流转](#资产状态流转)
- [权限模型](#权限模型)
- [API 接口概览](#api-接口概览)
- [Excel 导入规则](#excel-导入规则)
- [更新日志](#更新日志)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目界面
<img width="1920" height="919" alt="6f46b0aac925df5dc872d96a1b4a6e6a" src="https://github.com/user-attachments/assets/c8690746-31ba-4e9c-a10a-b3062148f2cf" />
<img width="1920" height="919" alt="4808d898e3d43bae25eb7416c9fae4d3" src="https://github.com/user-attachments/assets/bad4d7fd-15c1-4412-bf09-a290dc568c7d" />
<img width="1920" height="919" alt="8f73e9ae716c360bc5f493a3303e27c5" src="https://github.com/user-attachments/assets/a389ed42-3e31-40ed-9aa3-8134b51a6126" />

---

## 功能特性

### 资产全流程管理

- **入库管理** — 支持设备模板自动填充，批量 Excel 导入
- **出库 / 领用** — 直接出库或分配待领用，支持确认领用 / 取消分配
- **借用 / 归还** — 完整的借用与归还流转
- **调拨** — 跨部门资产调拨
- **维修管理** — 送修 / 维修完成，记录维修结果
- **报废处理** — 资产退役与报废登记

### 可视化仪表盘

- 资产总量统计与状态分布图表
- 部门资产分布概览
- 到期提醒与预警通知

### 审计与追踪

- 出入库记录查询（支持分页、搜索、日期范围筛选）
- 完整操作日志（摘要 + 结构化详情弹窗）
- 资产详情时间线（含全部历史流转与关键信息变更前后值）

### 系统管理

- **角色权限** — `super_admin` / `admin` / `viewer` 三级角色
- **用户管理** — 账号创建、停用、密码重置
- **部门管理** — 组织架构维护
- **设备模板** — 型号模板管理，关联资产数统计
- **系统配置** — 一人一机策略、提醒天数等
- **数据备份** — SQLite 数据库文件下载备份
- **Excel 导入导出** — 批量数据操作，支持预校验与无效行分析

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | Vue 3 + TypeScript | 组合式 API，类型安全 |
| **构建工具** | Vite 7 | 极速 HMR，高效构建 |
| **UI 组件库** | Element Plus | 企业级 Vue 3 组件库 |
| **图表** | ECharts + vue-echarts | 数据可视化 |
| **状态管理** | Pinia | 下一代 Vue 状态管理 |
| **路由** | Vue Router 5 | 支持路由级权限守卫 |
| **后端框架** | Express 5 | 高性能 Node.js Web 框架 |
| **ORM** | Prisma 7 | 类型安全的数据库访问层 |
| **数据库** | SQLite | 零配置、嵌入式关系型数据库 |
| **认证** | JWT + bcryptjs | 无状态令牌认证，密码哈希存储 |
| **代码质量** | ESLint + Oxlint + Prettier | 多层级代码检查与格式化 |
| **包管理** | pnpm | 高效磁盘利用，严格依赖管理 |

---

## 项目结构

```text
ComputerAsset/
├── frontend/                     # 前端应用
│   ├── src/
│   │   ├── main.ts               # 应用入口
│   │   ├── App.vue               # 根组件
│   │   ├── router/               # 路由配置（含权限守卫）
│   │   ├── stores/               # Pinia 状态仓库
│   │   ├── pages/                # 页面组件
│   │   ├── components/           # 公共组件
│   │   └── services/api.ts       # API 请求封装
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # 后端 API 服务
│   ├── src/
│   │   ├── server.ts             # 服务启动入口
│   │   ├── app.ts                # Express 应用配置
│   │   ├── prisma.ts             # Prisma 客户端实例
│   │   ├── routes/               # 路由模块
│   │   ├── middleware/           # 中间件（认证、权限）
│   │   ├── auth/                 # 认证逻辑
│   │   ├── bootstrap/seed.ts     # 初始数据填充
│   │   └── utils/                # 工具函数
│   ├── prisma/
│   │   ├── schema.prisma         # 数据库模型定义
│   │   └── migrations/           # 数据库迁移文件
│   ├── .env.example              # 环境变量模板
│   └── package.json
│
├── start.sh                  # 一键启动脚本（macOS / Linux）
├── start.bat                 # 一键启动脚本（Windows）
├── .gitignore
└── README.md
```

---

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 20.19.0（推荐 LTS 版本）
- [pnpm](https://pnpm.io/) >= 9（推荐使用 `corepack enable` 启用）

### 1. 克隆仓库

```bash
git clone https://github.com/Zzgj/ComputerAsset.git
cd ComputerAsset
```

### 2. 一键启动（推荐）

项目提供一键启动脚本，会自动完成环境检查、依赖安装、数据库迁移和服务启动：

**macOS / Linux：**

```bash
./start.sh
```

**Windows（双击或命令行）：**

```cmd
start.bat
```

启动脚本会依次执行以下可视化检查：

| 阶段 | 检查项 |
|------|--------|
| 环境检查 | Node.js 版本、pnpm 安装、项目目录、网络连通性 |
| 依赖与配置 | `.env` 配置文件、后端/前端依赖、数据库迁移 |
| 端口检查 | 后端端口 3000、前端端口 5173 是否被占用 |
| 启动服务 | 后端 → 等待就绪 → 前端 → 输出访问地址 |

所有检查通过后，前后端将同时启动，按 `Ctrl+C` 可一键停止所有服务。

### 3. 手动启动（可选）

如需分别启动前后端：

**启动后端：**

```bash
cd backend
cp .env.example .env          # 首次运行需复制环境变量
pnpm install                  # 安装依赖
pnpm exec prisma migrate deploy   # 执行数据库迁移
pnpm run dev                  # 启动开发服务器
```

后端默认地址：`http://127.0.0.1:3000`

**启动前端：**

```bash
cd frontend
pnpm install                  # 安装依赖
pnpm run dev                  # 启动开发服务器
```

前端默认地址：`http://localhost:5173`

> 开发模式下，前端 `/api` 请求会自动代理到后端服务。

### 4. 登录系统

首次启动时，系统会自动创建默认管理员账号：

| 字段 | 值 |
|------|------|
| 用户名 | `admin` |
| 密码 | `admin123` |
| 角色 | `super_admin` |

> **安全提醒**：该默认账号仅供开发和测试使用，部署到生产环境前请务必修改密码。

---

## 环境变量配置

后端环境变量通过 `backend/.env` 文件配置，参考 `.env.example`：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 后端服务端口 |
| `DATABASE_URL` | `file:./data/dev.db` | SQLite 数据库文件路径 |
| `JWT_SECRET` | — | JWT 签名密钥（**生产环境必须修改**） |
| `JWT_EXPIRES_IN` | `24h` | JWT 令牌有效期 |
| `BACKUP_DIR` | `backup` | 数据库备份目录（相对于 backend/） |
| `EXCEL_IMPORT_MAX_MB` | `20` | Excel 导入文件大小上限（MB），设为 `0` 不限制 |

前端开发环境可在 `frontend/.env.development` 中配置 API 代理目标：

```env
VITE_API_PROXY_TARGET=http://127.0.0.1:3000
```

---

## 生产环境部署

### 构建

```bash
# 构建前端
cd frontend
pnpm run build                # 输出到 frontend/dist/

# 构建后端
cd backend
pnpm run build                # 输出到 backend/dist/
```

### 运行

```bash
cd backend
pnpm exec prisma migrate deploy   # 确保数据库结构最新
pnpm run start                    # 启动生产服务器
```

> **部署建议**：
> - 使用反向代理（如 Nginx）将前端静态文件和后端 API 统一为同一域名
> - 通过 PM2 或 systemd 守护后端进程
> - 生产环境务必设置高强度的 `JWT_SECRET`
> - 定期通过系统内置功能备份 SQLite 数据库文件

---

## 资产状态流转

```text
┌──────┐    分配     ┌────────┐   确认领用   ┌───────┐
│ 在库 │ ──────────▶ │ 待领用 │ ──────────▶ │ 使用中 │
└──┬───┘             └────┬───┘              └───┬───┘
   │                      │ 取消分配              │
   │                      ▼                      │ 归还
   │                   ┌──────┐                  │
   │   直接出库 ──────▶│ 使用中│◀─────────────────┘
   │                   └──────┘
   │
   │   借出     ┌────────┐   归还
   ├──────────▶ │ 借用中 │ ──────────▶ 在库
   │            └────────┘
   │
   ▼ (任意状态)
┌────────┐   维修完成   ┌──────┐
│ 维修中 │ ──────────▶ │ 在库 │
└────┬───┘              └──────┘
     │ 无法修复
     ▼
┌────────┐
│ 已报废 │ ◀──────── (任意状态均可直接报废)
└────────┘
```

---

## 权限模型

系统内置三种角色，权限逐级递增：

| 功能模块 | super_admin | admin | viewer |
|----------|:-----------:|:-----:|:------:|
| 仪表盘 / 资产列表 / 资产详情 / 记录查看 | ✅ | ✅ | ✅ |
| 入库 / 出库 / 借用 / 归还 / 调拨 / 维修 / 报废 | ✅ | ✅ | ❌ |
| 部门管理 / 设备模板管理 / 导入导出 | ✅ | ✅ | ❌ |
| 用户管理 / 角色管理 / 系统配置 / 数据备份 | ✅ | ❌ | ❌ |
| 删除资产 | ✅ | ❌ | ❌ |
| 编辑资产关键信息（编号 / 序列号 / 品牌等） | ✅（需二次确认） | ❌ | ❌ |

---

## API 接口概览

所有接口以 `/api` 为前缀，主要分组如下：

| 路由前缀 | 功能说明 |
|----------|----------|
| `/api/auth` | 认证（登录 / 登出 / 令牌刷新） |
| `/api/assets` | 资产 CRUD |
| `/api/operations` | 业务操作（出库、借用、归还、调拨、维修、报废等） |
| `/api/dashboard` | 仪表盘统计数据 |
| `/api/records` | 出入库记录 |
| `/api/logs` | 操作日志 |
| `/api/templates` | 设备模板管理 |
| `/api/departments` | 部门管理 |
| `/api/users` | 用户管理 |
| `/api/roles` | 角色管理 |
| `/api/config` | 系统配置 |
| `/api/excel` | Excel 导入导出 |
| `/api/backup` | 数据库备份 |
| `/api/health` | 健康检查 |

---

## Excel 导入规则

### 基本规则

- 仅读取 Excel 文件第一个工作表
- 空白尾行自动忽略
- **电脑编号**为必填字段，缺失则判定为无效行并跳过

### 模板匹配

1. 优先按「模板名称」精确匹配已登记模板
2. 若未命中，则按「品牌 + 型号」组合匹配
3. 未登记型号将提示选择：创建模板并导入，或仅导入资产

### 数据校验

| 校验项 | 规则 |
|--------|------|
| 状态与人员 | 待领用 / 使用中 / 借用中状态时，「现定人」必填；在库状态自动清空 |
| 序列号唯一性 | 同批次内不可重复；与库内已有资产不可冲突；为空时自动填充 `暂无-电脑编号` |
| 日期格式 | 采购日期、保修到期日格式非法时，该行判定无效并跳过 |

### 预校验

导入前系统会执行预校验，展示检测条数、可导入条数、无效条数，以及无效原因分组统计与明细（行号 + 原因），正式导入时无效行自动跳过。

---

## 更新日志

### v1.4.2

**部署与内网体验**
- 部署构建时注入 `VITE_PUBLIC_BASE_URL`（默认 `http://10.2.254.29:3000`），出库/借出二维码与签名链接指向可被手机与其他电脑访问的服务器地址，避免误用 `localhost`
- 生产构建关闭 Vue DevTools 插件；移除对 Google Fonts 外链，减轻内网离线环境下的超时与首屏卡顿
- 复制签名链接在无 `navigator.clipboard` 或 HTTP 场景下增加 `textarea` 降级复制

**功能与界面**
- 入库登记「设备类型」下拉合并模板中已使用的自定义类型，并在型号管理中新增类型后写入会话，便于入库页立即选用
- 登录页与侧栏显示当前应用版本号（与 `package.json` 一致）

### v1.4.1

**Bug 修复与功能增强**
- 修复设备模板自定义设备类型保存时提示 `deviceType is invalid` 的问题（后端放宽枚举校验）
- 出库/借出后资产状态改为「待签字确认」，领用人/借用人扫码签名后自动转为「使用中」或「借用中」
- 签名页改为独立页面，不显示侧边栏和导航，避免影响主账号
- 借出操作增加扫码签名确认功能，与出库流程一致
- 资产详情页流转记录中显示手写签名图片，未签名的出库/借出记录标注「未签名确认」
- 新增 `pending_confirmation`（待签字确认）资产状态，资产列表支持按此状态筛选

### v1.4.0

**出库签名确认**
- 直接领用出库后自动生成二维码，领用人扫码进入签名页
- 签名页展示完整领用信息（资产编号、领用人、部门、时间、备注）
- 手写签名画板支持鼠标和触屏操作，签名存储为图片附在流转记录中
- 支持复制签名链接，可通过微信等方式分享给领用人

**单账号登录限制**
- 同一账号同时只能在一处登录，新登录自动踢掉旧会话
- 被踢出后跳转登录页并显示「已在其他设备登录」提示
- 退出登录时清除会话令牌

**仪表盘增强**
- 统计卡片（资产总数/在库/使用中/借用中）点击直接跳转到资产列表并按状态筛选

**借用归还时间**
- 借用中资产在详情页显示预计归还日期提示
- 流转时间线中借出记录标注预计归还日期

**曾用人搜索**
- 资产列表新增「曾用人搜索」，可搜索历史上曾使用过某资产的人员
- 支持模糊匹配，适用于离职人员设备追溯场景

**归还登记分页**
- 归还登记页从固定显示 100 条改为分页（20/50/100 可选），显示总数

**角色管理审计**
- 新建、编辑、删除角色操作均写入操作日志

**设备模板优化**
- 设备类型支持自定义输入（保留预设选项，也可输入自定义类型）
- 移除排序号字段，简化模板管理

**搜索修复**
- 修复资产列表中文搜索无反应（IME 组合输入不触发搜索）

### v1.3.0

**设备类型与入库**

- 设备类型新增「其他」，与后端 Prisma 枚举一致；模板检索支持「其他 / other」关键词
- 入库页支持先选设备类型；型号模板改为可选，可手动填写品牌、型号、操作系统、CPU、内存、存储
- 「其他」类型下品牌、型号可为空；非其他类型仍校验品牌、型号
- 资产编号生成支持按设备类型区分前缀（如笔记本/台式 `PC`、一体机 `AIO`、服务器 `SRV`、其他 `OTH`）
- 文案统一为「资产编号」；重复入库提示与列表筛选、路由查询参数联动

**资产列表**

- 新增按设备类型筛选
- 新增「列设置」：可显隐设备类型、品牌、型号、序列号、状态、使用人、园区、部门、设备模板等列；偏好保存在本机浏览器

**园区管理**

- 超级管理员可新增园区、删除当前园区（删除前校验关联资产、部门、角色园区范围）
- 部门管理页展示全部园区（不再仅显示前若干条）

**角色管理**

- 新建角色时由后端自动分配唯一 `slug`，无需手填
- 角色列表「园区范围」展示具体园区名称

**资产详情**

- 仅当品牌、型号、操作系统、CPU、内存、存储等模板相关字段变更时才解除模板关联；仅改编号或序列号不再强制解绑

**升级说明**

- 本版本扩展了设备类型枚举；升级时请在 `backend` 目录执行 Prisma 迁移（开发环境可用 `pnpm exec prisma migrate dev` 生成并应用；生产环境在已有迁移文件的前提下执行 `pnpm exec prisma migrate deploy`）

### v1.2.0

**全新 UI 设计**
- 建立全局 CSS 设计系统（Indigo/Violet 主色调、Inter 字体、统一阴影/圆角/动画）
- 登录页重新设计为左右分栏布局，左侧品牌展示面板 + 右侧登录表单
- 侧边栏深色渐变主题（用户头像、发光导航指示器、SVG 图标按钮）
- 仪表盘四色渐变统计卡、环形饼图、统一配色柱状图
- 全部 16 个页面统一标题样式、入场动画、卡片间距、表格头样式
- 引入 Element Plus 中文语言包

**一键启动脚本**
- 新增 `start.sh`（macOS/Linux）和 `start.bat`（Windows）
- 四阶段可视化预检：环境、依赖、端口、服务启动
- 端口冲突自动检测占用进程并提示终止
- 后端启动失败时显示故障排查指南
- Prisma 生成失败自动重试
- Ctrl+C 一键优雅停止所有服务

**空闲自动退出**
- 10 分钟无操作自动退出登录，保障账号安全
- 退出前 60 秒弹出预警对话框（动画时钟 + 倒计时）
- 用户可点击「继续使用」重置计时器
- 活动事件 2 秒节流，避免高频触发

**代码质量优化**
- API 层增加 401 自动跳转登录、响应解析容错
- 路由守卫 `await logout()` 修复竞态；权限不足时显示提示
- 仪表盘、出库页、资产详情页补全错误处理和加载状态
- 资产详情校验无效 ID，防止 NaN 请求
- 后端 CORS 支持配置白名单（`CORS_ORIGINS` 环境变量）
- JSON 请求体限制从 20MB 降至 2MB（Excel 走 multipart 不受影响）
- 服务端增加 SIGINT/SIGTERM 优雅退出
- 密码重置日志不再记录明文密码

**其他**
- 删除 `deploy/` 文件夹及 Windows Server 2019 部署方案
- README.md 全面重构，增加徽章、目录、部署指南、贡献规范
- 新增 `pnpm-workspace.yaml` 预配置原生模块构建权限

### v1.1.x

**导入导出增强**
- 导入预校验增加统计提示（检测 / 有效 / 无效）
- 新增无效原因分组统计与行级明细展示
- 修复空白尾行误报「缺少电脑编号」
- 序列号冲突行自动跳过，不再整批失败
- 增加状态与人员联动校验

**模板与资产关联**
- 设备模板页新增「关联资产数」列
- 资产列表及详情显示设备模板来源（模板名 / 自定义）
- 手动修改关键信息自动解除模板关联

**记录与日志优化**
- 出入库记录支持分页与多维度搜索
- 操作日志改为摘要 + 详情弹窗结构化展示
- 资产时间线支持展示关键信息变更前后值

**高权限资产改号流程**
- 关键信息编辑权限收敛为 `super_admin`
- 编辑前增加高风险确认提示
- 修改详情写入操作日志，支持审计追溯

---

## 贡献指南

欢迎提交 Issue 和 Pull Request 参与项目改进。

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交变更：`git commit -m "feat: add your feature"`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

**提交规范**建议遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

| 前缀 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复缺陷 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构 |
| `chore` | 构建 / 工具链变更 |

---

## 许可证

本项目基于 [ISC 许可证](https://opensource.org/licenses/ISC) 开源发布。

---

<div align="center">

**[⬆ 回到顶部](#computerasset)**

</div>
