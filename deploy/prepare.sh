#!/usr/bin/env bash
# ============================================================
#  ComputerAsset 部署包构建脚本
#  在有网络的机器上运行，生成可部署到内网 Windows Server 的完整包
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$ROOT_DIR/deploy-package"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo ""
echo -e "${BOLD}ComputerAsset 部署包构建工具${NC}"
echo -e "${DIM}在有网络的机器上运行, 构建产物可直接拷贝到内网服务器${NC}"
echo ""

# 1. 检查环境
echo -e "[1] 检查环境 ..."
command -v node >/dev/null 2>&1 || { echo -e "${RED}未安装 Node.js${NC}"; exit 1; }
echo -e "    ${GREEN}[通过]${NC} Node.js $(node -v)"

command -v pnpm >/dev/null 2>&1 || {
  echo "    未找到 pnpm, 通过 corepack 启用 ..."
  corepack enable && corepack prepare pnpm@latest --activate
}
echo -e "    ${GREEN}[通过]${NC} pnpm v$(pnpm -v)"

# 2. 清理
echo ""
echo "[2] 清理旧的构建产物 ..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
echo -e "    ${GREEN}[通过]${NC} 已清理"

# 3. 后端
echo ""
echo "[3] 安装后端依赖 ..."
cd "$BACKEND_DIR"
pnpm install
pnpm approve-builds --all 2>/dev/null || true
echo -e "    ${GREEN}[通过]${NC}"

echo ""
echo "[4] 生成 Prisma 客户端 ..."
cd "$BACKEND_DIR"
pnpm exec prisma generate
echo -e "    ${GREEN}[通过]${NC}"

echo ""
echo "[5] 构建后端 ..."
cd "$BACKEND_DIR"
pnpm run build
echo -e "    ${GREEN}[通过]${NC}"

# 4. 前端
echo ""
echo "[6] 安装前端依赖并构建 ..."
cd "$FRONTEND_DIR"
pnpm install
pnpm approve-builds --all 2>/dev/null || true
pnpm run build
echo -e "    ${GREEN}[通过]${NC}"

# 5. 组装
echo ""
echo "[7] 组装部署包 ..."

mkdir -p "$DEPLOY_DIR/backend/dist"
mkdir -p "$DEPLOY_DIR/backend/prisma/migrations"
mkdir -p "$DEPLOY_DIR/frontend/dist"

cp -r "$BACKEND_DIR/dist/"* "$DEPLOY_DIR/backend/dist/"
cp -r "$BACKEND_DIR/node_modules" "$DEPLOY_DIR/backend/node_modules"
cp "$BACKEND_DIR/prisma/schema.prisma" "$DEPLOY_DIR/backend/prisma/"
cp -r "$BACKEND_DIR/prisma/migrations/"* "$DEPLOY_DIR/backend/prisma/migrations/"
cp "$BACKEND_DIR/prisma.config.ts" "$DEPLOY_DIR/backend/"
cp "$BACKEND_DIR/package.json" "$DEPLOY_DIR/backend/"
cp "$BACKEND_DIR/.env.example" "$DEPLOY_DIR/backend/"

cp -r "$FRONTEND_DIR/dist/"* "$DEPLOY_DIR/frontend/dist/"

cp "$ROOT_DIR/deploy/deploy.bat" "$DEPLOY_DIR/"
cp "$ROOT_DIR/deploy/stop.bat" "$DEPLOY_DIR/"
cp "$ROOT_DIR/deploy/README.txt" "$DEPLOY_DIR/"

echo -e "    ${GREEN}[通过]${NC}"

# 6. 输出
SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
echo ""
echo -e "${GREEN}${BOLD}构建完成!${NC}"
echo -e "    位置 : $DEPLOY_DIR"
echo -e "    大小 : $SIZE"
echo ""
echo "将 deploy-package 文件夹拷贝到目标服务器, 运行 deploy.bat 即可"
echo ""
