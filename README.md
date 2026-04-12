<div align="center">

# ComputerAsset - Server Deploy Edition

### 企业电脑资产管理系统 · 服务器部署版

本分支为 **Windows Server 内网离线部署专用版本**，包含完整的部署脚本和工具链。

功能代码与 [`main`](https://github.com/Zzgj/ComputerAsset/tree/main) 分支保持同步。

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/Zzgj/ComputerAsset)
[![Branch](https://img.shields.io/badge/branch-deploy%2Fwindows--server-orange.svg)](https://github.com/Zzgj/ComputerAsset/tree/deploy/windows-server)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](https://opensource.org/licenses/ISC)

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

完成后生成 `deploy-package/` 文件夹，这就是完整的部署包。

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
