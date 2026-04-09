#!/usr/bin/env bash
# ============================================================
#  ComputerAsset 一键启动脚本
#  适用于 macOS / Linux / Git Bash (Windows)
# ============================================================

set -e

# ── 颜色与符号定义 ──────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

PASS="${GREEN}✔${NC}"
FAIL="${RED}✘${NC}"
WARN="${YELLOW}⚠${NC}"
INFO="${BLUE}●${NC}"
ARROW="${CYAN}→${NC}"

# ── 工具函数 ────────────────────────────────────────────────
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PORT=3000
FRONTEND_PORT=5173

step_count=0
fail_count=0

header() {
  echo ""
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${PURPLE}  $1${NC}"
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

step() {
  step_count=$((step_count + 1))
  echo -e "\n${WHITE}[$step_count]${NC} $1"
}

ok() {
  echo -e "    ${PASS} $1"
}

warn() {
  echo -e "    ${WARN} $1"
}

fail() {
  echo -e "    ${FAIL} $1"
  fail_count=$((fail_count + 1))
}

info() {
  echo -e "    ${INFO} $1"
}

divider() {
  echo -e "${DIM}    ─────────────────────────────────────────${NC}"
}

# 检测端口是否被占用
port_in_use() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
  elif command -v ss >/dev/null 2>&1; then
    ss -tlnp 2>/dev/null | grep -q ":$port "
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tlnp 2>/dev/null | grep -q ":$port "
  else
    return 1
  fi
}

# 读取 backend/.env 中的 PORT
read_backend_port() {
  if [ -f "$BACKEND_DIR/.env" ]; then
    local p
    p=$(grep -E '^PORT=' "$BACKEND_DIR/.env" 2>/dev/null | head -1 | cut -d'=' -f2 | tr -d ' "'"'"'\r\n')
    if [ -n "$p" ] && [ "$p" -eq "$p" ] 2>/dev/null; then
      BACKEND_PORT=$p
    fi
  fi
}

# ── Banner ──────────────────────────────────────────────────
clear 2>/dev/null || true
echo ""
echo -e "${PURPLE}${BOLD}"
echo "   ╔═══════════════════════════════════════════════╗"
echo "   ║                                               ║"
echo "   ║        ComputerAsset  启动程序                ║"
echo "   ║        电脑资产管理系统 v1.1.5                ║"
echo "   ║                                               ║"
echo "   ╚═══════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "    ${DIM}项目目录: $ROOT_DIR${NC}"
echo -e "    ${DIM}启动时间: $(date '+%Y-%m-%d %H:%M:%S')${NC}"

# ════════════════════════════════════════════════════════════
#  阶段 1：环境检查
# ════════════════════════════════════════════════════════════
header "阶段 1/4  环境检查"

# ── 1. Node.js ──
step "检查 Node.js 运行时"
if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node -v)
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/^v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ] 2>/dev/null; then
    ok "Node.js ${GREEN}$NODE_VER${NC}  ${DIM}(要求 ≥ v20)${NC}"
  else
    fail "Node.js $NODE_VER 版本过低，需要 v20 或更高"
  fi
else
  fail "未安装 Node.js — 请先安装 https://nodejs.org/"
fi

# ── 2. pnpm ──
step "检查 pnpm 包管理器"
if command -v pnpm >/dev/null 2>&1; then
  PNPM_VER=$(pnpm -v)
  ok "pnpm ${GREEN}v$PNPM_VER${NC}"
else
  warn "未安装 pnpm，尝试通过 corepack 启用..."
  if command -v corepack >/dev/null 2>&1; then
    corepack enable 2>/dev/null && corepack prepare pnpm@latest --activate 2>/dev/null
    if command -v pnpm >/dev/null 2>&1; then
      ok "已通过 corepack 安装 pnpm $(pnpm -v)"
    else
      fail "corepack 启用 pnpm 失败，请手动安装: npm install -g pnpm"
    fi
  else
    fail "未安装 pnpm 且 corepack 不可用，请运行: npm install -g pnpm"
  fi
fi

# ── 3. 项目目录 ──
step "检查项目目录结构"
dir_ok=true
for d in "$BACKEND_DIR" "$FRONTEND_DIR" "$BACKEND_DIR/prisma"; do
  if [ -d "$d" ]; then
    ok "$(basename "$d")/ ${DIM}存在${NC}"
  else
    fail "缺少目录: $d"
    dir_ok=false
  fi
done

# ── 4. 网络连通性 ──
step "检查网络连通性"
if command -v curl >/dev/null 2>&1; then
  if curl -s --connect-timeout 5 --max-time 8 https://registry.npmmirror.com/ >/dev/null 2>&1; then
    ok "npm 镜像可达 ${DIM}(registry.npmmirror.com)${NC}"
  elif curl -s --connect-timeout 5 --max-time 8 https://registry.npmjs.org/ >/dev/null 2>&1; then
    ok "npm 官方源可达 ${DIM}(registry.npmjs.org)${NC}"
  else
    warn "无法访问 npm 源 — 若依赖已安装则不影响启动"
  fi
elif command -v ping >/dev/null 2>&1; then
  if ping -c 1 -W 3 8.8.8.8 >/dev/null 2>&1; then
    ok "网络连通 ${DIM}(ping 8.8.8.8)${NC}"
  else
    warn "网络不通 — 若依赖已安装则不影响启动"
  fi
else
  warn "无法检测网络（curl/ping 均不可用）"
fi

# ════════════════════════════════════════════════════════════
#  阶段 2：依赖与配置
# ════════════════════════════════════════════════════════════
header "阶段 2/4  依赖与配置"

# ── 5. 后端 .env ──
step "检查后端环境变量配置"
if [ -f "$BACKEND_DIR/.env" ]; then
  ok ".env 文件已存在"
  # 校验关键变量
  for key in DATABASE_URL JWT_SECRET; do
    if grep -qE "^${key}=" "$BACKEND_DIR/.env" 2>/dev/null; then
      ok "$key ${DIM}已配置${NC}"
    else
      fail "$key 未在 .env 中配置"
    fi
  done
else
  warn ".env 不存在，正在从 .env.example 复制..."
  if [ -f "$BACKEND_DIR/.env.example" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    ok "已创建 .env（使用默认配置）"
    warn "生产环境请务必修改 JWT_SECRET！"
  else
    fail "找不到 .env.example，无法自动创建 .env"
  fi
fi
read_backend_port

# ── 6. 后端依赖 ──
step "检查后端依赖 (backend/node_modules)"
if [ -d "$BACKEND_DIR/node_modules" ]; then
  ok "node_modules 已存在"
else
  info "正在安装后端依赖..."
  (cd "$BACKEND_DIR" && pnpm install --frozen-lockfile 2>&1) | while IFS= read -r line; do
    echo -e "    ${DIM}  $line${NC}"
  done
  if [ -d "$BACKEND_DIR/node_modules" ]; then
    ok "后端依赖安装完成"
  else
    fail "后端依赖安装失败"
  fi
fi
info "允许原生模块构建 (esbuild, prisma, better-sqlite3)..."
(cd "$BACKEND_DIR" && pnpm approve-builds --all 2>&1) | tail -1 | while IFS= read -r line; do
  echo -e "    ${DIM}  $line${NC}"
done
ok "原生模块构建完成"

# ── 7. 前端依赖 ──
step "检查前端依赖 (frontend/node_modules)"
if [ -d "$FRONTEND_DIR/node_modules" ]; then
  ok "node_modules 已存在"
else
  info "正在安装前端依赖..."
  (cd "$FRONTEND_DIR" && pnpm install --frozen-lockfile 2>&1) | while IFS= read -r line; do
    echo -e "    ${DIM}  $line${NC}"
  done
  if [ -d "$FRONTEND_DIR/node_modules" ]; then
    ok "前端依赖安装完成"
  else
    fail "前端依赖安装失败"
  fi
fi
(cd "$FRONTEND_DIR" && pnpm approve-builds --all 2>/dev/null) || true

# ── 8. Prisma 客户端生成 ──
step "生成 Prisma 客户端"
GENERATE_OUT=$(cd "$BACKEND_DIR" && pnpm exec prisma generate 2>&1) || true
if echo "$GENERATE_OUT" | grep -qi "error"; then
  warn "Prisma generate 输出包含错误："
  echo "$GENERATE_OUT" | head -6 | while IFS= read -r line; do
    echo -e "    ${DIM}  $line${NC}"
  done
else
  ok "Prisma 客户端已生成"
fi

# ── 9. 数据库迁移 ──
step "检查数据库迁移状态"
info "执行 prisma migrate deploy..."
MIGRATE_OUT=$(cd "$BACKEND_DIR" && pnpm exec prisma migrate deploy 2>&1) || true
if echo "$MIGRATE_OUT" | grep -qi "error"; then
  warn "迁移输出包含警告/错误，请检查："
  echo "$MIGRATE_OUT" | head -8 | while IFS= read -r line; do
    echo -e "    ${DIM}  $line${NC}"
  done
else
  ok "数据库迁移完成"
fi

# ════════════════════════════════════════════════════════════
#  阶段 3：端口检查
# ════════════════════════════════════════════════════════════
header "阶段 3/4  端口检查"

step "检查后端端口 :$BACKEND_PORT"
if port_in_use "$BACKEND_PORT"; then
  warn "端口 $BACKEND_PORT 已被占用！"
  if command -v lsof >/dev/null 2>&1; then
    PROC=$(lsof -iTCP:"$BACKEND_PORT" -sTCP:LISTEN -t 2>/dev/null | head -1)
    if [ -n "$PROC" ]; then
      PNAME=$(ps -p "$PROC" -o comm= 2>/dev/null || echo "unknown")
      warn "占用进程: PID=$PROC ($PNAME)"
      echo ""
      echo -e "    ${YELLOW}是否终止该进程？(y/N)${NC}"
      read -r -t 10 KILL_CHOICE || KILL_CHOICE="n"
      if [ "$KILL_CHOICE" = "y" ] || [ "$KILL_CHOICE" = "Y" ]; then
        kill "$PROC" 2>/dev/null && sleep 1
        if port_in_use "$BACKEND_PORT"; then
          kill -9 "$PROC" 2>/dev/null && sleep 1
        fi
        if port_in_use "$BACKEND_PORT"; then
          fail "无法释放端口 $BACKEND_PORT"
        else
          ok "端口 $BACKEND_PORT 已释放"
        fi
      else
        fail "端口 $BACKEND_PORT 被占用，后端可能无法启动"
      fi
    fi
  else
    fail "端口 $BACKEND_PORT 被占用，请手动释放"
  fi
else
  ok "端口 $BACKEND_PORT 可用"
fi

step "检查前端端口 :$FRONTEND_PORT"
if port_in_use "$FRONTEND_PORT"; then
  warn "端口 $FRONTEND_PORT 已被占用（Vite 会自动尝试下一个端口）"
else
  ok "端口 $FRONTEND_PORT 可用"
fi

# ════════════════════════════════════════════════════════════
#  检查结果汇总
# ════════════════════════════════════════════════════════════
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$fail_count" -gt 0 ]; then
  echo -e "  ${RED}${BOLD}预检发现 $fail_count 个问题${NC}"
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${YELLOW}是否仍然尝试启动？(y/N)${NC}"
  read -r -t 15 CONTINUE_CHOICE || CONTINUE_CHOICE="n"
  if [ "$CONTINUE_CHOICE" != "y" ] && [ "$CONTINUE_CHOICE" != "Y" ]; then
    echo -e "\n  ${DIM}已取消启动。请修复上述问题后重试。${NC}\n"
    exit 1
  fi
else
  echo -e "  ${GREEN}${BOLD}所有检查通过！${NC}"
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
fi

# ════════════════════════════════════════════════════════════
#  阶段 4：启动服务
# ════════════════════════════════════════════════════════════
header "阶段 4/4  启动服务"

# 后台启动后端
step "启动后端服务 ${DIM}(Express + Prisma + SQLite)${NC}"
info "命令: cd backend && pnpm run dev"
info "端口: ${CYAN}http://127.0.0.1:$BACKEND_PORT${NC}"
divider

cd "$BACKEND_DIR"
pnpm run dev &
BACKEND_PID=$!
cd "$ROOT_DIR"

# 等待后端就绪
echo -e "    ${DIM}等待后端服务就绪...${NC}"
WAIT_COUNT=0
WAIT_MAX=30
BACKEND_READY=false
while [ $WAIT_COUNT -lt $WAIT_MAX ]; do
  sleep 1
  WAIT_COUNT=$((WAIT_COUNT + 1))
  if command -v curl >/dev/null 2>&1; then
    if curl -s --connect-timeout 2 "http://127.0.0.1:$BACKEND_PORT/api/health" >/dev/null 2>&1; then
      BACKEND_READY=true
      break
    fi
  else
    if port_in_use "$BACKEND_PORT"; then
      BACKEND_READY=true
      break
    fi
  fi
  # 检查进程是否还存在
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    break
  fi
done

if $BACKEND_READY; then
  ok "后端服务已就绪 ${DIM}(${WAIT_COUNT}s)${NC}"
else
  warn "后端服务可能仍在启动中 ${DIM}(已等待 ${WAIT_COUNT}s)${NC}"
fi

# 启动前端
step "启动前端服务 ${DIM}(Vite + Vue 3)${NC}"
info "命令: cd frontend && pnpm run dev"
info "端口: ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
divider

cd "$FRONTEND_DIR"
pnpm run dev &
FRONTEND_PID=$!
cd "$ROOT_DIR"

# 等待前端就绪
sleep 3

# ── 最终输出 ────────────────────────────────────────────────
echo ""
echo ""
echo -e "${GREEN}${BOLD}"
echo "   ╔═══════════════════════════════════════════════╗"
echo "   ║                                               ║"
echo "   ║    ✔  ComputerAsset 启动成功！                ║"
echo "   ║                                               ║"
echo "   ╠═══════════════════════════════════════════════╣"
echo -e "   ║                                               ║"
echo -e "   ║    前端:  ${WHITE}http://localhost:$FRONTEND_PORT${GREEN}           ║"
echo -e "   ║    后端:  ${WHITE}http://127.0.0.1:$BACKEND_PORT${GREEN}           ║"
echo -e "   ║                                               ║"
echo -e "   ║    默认账号: admin / admin123                  ║"
echo "   ║                                               ║"
echo "   ╚═══════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "  ${DIM}提示：按 Ctrl+C 可同时停止前后端服务${NC}"
echo ""

# 优雅退出：Ctrl+C 时同时终止前后端
cleanup() {
  echo ""
  echo -e "\n${YELLOW}正在停止服务...${NC}"
  kill "$BACKEND_PID" 2>/dev/null
  kill "$FRONTEND_PID" 2>/dev/null
  wait "$BACKEND_PID" 2>/dev/null
  wait "$FRONTEND_PID" 2>/dev/null
  echo -e "${GREEN}所有服务已停止。再见！${NC}\n"
  exit 0
}

trap cleanup INT TERM

# 保持前台运行，等待子进程
wait
