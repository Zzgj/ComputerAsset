# ComputerAsset（电脑资产管理系统）

前后端同仓库的独立项目：**Vue 3 + Vite** 前端与 **Express + Prisma + SQLite** 后端。

- 远程仓库：<https://github.com/Zzgj/ComputerAsset>

## 目录结构

```
.
├── frontend/          # 前端（原开发目录已统一为 frontend）
├── backend/           # 后端 API
├── README.md          # 本说明
└── .gitignore
```

详细产品说明、页面与接口约定见 **`frontend/README.md`**。

## 环境要求

- Node.js（建议 LTS，如 v20+）
- [pnpm](https://pnpm.io/)（或 npm/yarn，按习惯调整命令）

## 本地开发

### 1. 后端

```bash
cd backend
cp .env.example .env   # 首次：按需编辑 DATABASE_URL、JWT_SECRET 等
pnpm install
pnpm exec prisma migrate deploy   # 或开发时用 prisma migrate dev
pnpm run dev
```

默认 API 端口见 `backend` 内配置（常见为 `3000`）。

### 2. 前端

```bash
cd frontend
pnpm install
pnpm dev
```

开发模式下 Vite 会将 `/api` 代理到后端；若后端端口不是 3000，可在 **`frontend/.env.development`** 中设置 `VITE_API_PROXY_TARGET`。

### 3. 默认账号

若启用了种子数据，默认管理员账号见 `backend` 启动日志或 `frontend/README.md` 中的说明（常见为 `admin` / `admin123`，**生产环境请务必修改**）。

## 推送到 GitHub（首次）

在 **`Demo` 仓库根目录**（本文件所在目录）执行：

```bash
git init
git add .
git commit -m "chore: initial import ComputerAsset monorepo"
git branch -M main
git remote add origin https://github.com/Zzgj/ComputerAsset.git
git push -u origin main
```

若远程已有提交，可能需要先 `git pull origin main --allow-unrelated-histories` 再推送。HTTPS 推送需 [Personal Access Token](https://github.com/settings/tokens) 或已配置的凭据。

## 不应提交的内容

已由根目录 `.gitignore` 排除，例如：`node_modules/`、`dist/`、`backend/data/*.db`、根目录 `*.db`、`.env`、`backup/` 等。克隆仓库后请在本地重新安装依赖并迁移数据库。

## 清理旧目录名 `Cursor`

若本地仍存在 **`Cursor/`** 文件夹（与 `frontend/` 重复），请先**停止**占用该目录的终端（如 `pnpm dev`）与编辑器，再手动删除 `Cursor/`，然后从 `.gitignore` 中删除 `/Cursor/` 那一行，避免长期忽略同名目录。
