#!/usr/bin/env bash
# ============================================================
#  ComputerAsset 一键启动脚本
#  适用于 macOS / Linux / Git Bash (Windows)
# ============================================================

set -e

# ── 颜色与符号 ──────────────────────────────────────────────
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

PASS="${GREEN}[通过]${NC}"
FAIL="${RED}[失败]${NC}"
WARN="${YELLOW}[警告]${NC}"
INFO="${BLUE}[....]${NC}"
CONFLICT="${RED}[冲突]${NC}"

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
  echo -e "${PURPLE}-----------------------------------------------------------${NC}"
  echo -e "${PURPLE}  $1${NC}"
  echo -e "${PURPLE}-----------------------------------------------------------${NC}"
}

step() {
  step_count=$((step_count + 1))
  echo -e "\n${WHITE}[$step_count]${NC} $1"
}

ok()   { echo -e "    ${PASS} $1"; }
warn() { echo -e "    ${WARN} $1"; }
info() { echo -e "    ${INFO} $1"; }

fail() {
  echo -e "    ${FAIL} $1"
  fail_count=$((fail_count + 1))
}

divider() {
  echo -e "    ${DIM}--------------------------------------------${NC}"
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

# 获取占用端口的进程信息
get_port_process() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    local pid
    pid=$(lsof -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | head -1)
    if [ -n "$pid" ]; then
      local pname
      pname=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
      echo "$pid|$pname"
    fi
  fi
}

# 终止占用端口的进程
kill_port_process() {
  local port=$1
  local info
  info=$(get_port_process "$port")
  if [ -z "$info" ]; then return 1; fi

  local pid="${info%%|*}"
  local pname="${info##*|}"

  echo -e "    ${CONFLICT} 端口 $port 已被占用 (PID: $pid, 进程: $pname)"
  echo ""
  echo -e "    ${YELLOW}是否终止该进程以释放端口? (y/N)${NC}"
  read -r -t 15 KILL_CHOICE || KILL_CHOICE="n"

  if [ "$KILL_CHOICE" = "y" ] || [ "$KILL_CHOICE" = "Y" ]; then
    kill "$pid" 2>/dev/null && sleep 1
    if port_in_use "$port"; then
      kill -9 "$pid" 2>/dev/null && sleep 1
    fi
    if port_in_use "$port"; then
      fail "无法释放端口 $port"
      return 1
    else
      ok "端口 $port 已释放"
      return 0
    fi
  else
    fail "端口 $port 被占用，服务可能无法启动"
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
echo "   +---------------------------------------------------+"
echo "   |                                                   |"
echo "   |        ComputerAsset                              |"
echo "   |        电脑资产管理系统 v1.4.3                    |"
echo "   |                                                   |"
echo "   +---------------------------------------------------+"
echo -e "${NC}"
echo -e "    ${DIM}项目目录 : $ROOT_DIR${NC}"
echo -e "    ${DIM}启动时间 : $(date '+%Y-%m-%d %H:%M:%S')${NC}"

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
    ok "Node.js ${GREEN}$NODE_VER${NC}  ${DIM}(要求 >= v20)${NC}"
  else
    fail "Node.js $NODE_VER 版本过低，需要 v20 或更高"
  fi
else
  fail "未安装 Node.js -- 请先安装 https://nodejs.org/"
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
for d in "$BACKEND_DIR" "$FRONTEND_DIR" "$BACKEND_DIR/prisma"; do
  if [ -d "$d" ]; then
    ok "$(basename "$d")/ ${DIM}存在${NC}"
  else
    fail "缺少目录: $d"
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
    warn "无法访问 npm 源 -- 若依赖已安装则不影响启动"
  fi
elif command -v ping >/dev/null 2>&1; then
  if ping -c 1 -W 3 8.8.8.8 >/dev/null 2>&1; then
    ok "网络连通 ${DIM}(ping 8.8.8.8)${NC}"
  else
    warn "网络不通 -- 若依赖已安装则不影响启动"
  fi
else
  warn "无法检测网络 (curl/ping 均不可用)"
fi

# ════════════════════════════════════════════════════════════
#  阶段 2：依赖与配置
# ════════════════════════════════════════════════════════════
header "阶段 2/4  依赖与配置"

# ── 5. 后端 .env ──
step "检查后端环境变量配置"
if [ -f "$BACKEND_DIR/.env" ]; then
  ok ".env 文件已存在"
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
    ok "已创建 .env (使用默认配置)"
    warn "生产环境请务必修改 JWT_SECRET !"
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
  (cd "$BACKEND_DIR" && pnpm install 2>&1) | while IFS= read -r line; do
    echo -e "    ${DIM}  $line${NC}"
  done
  if [ -d "$BACKEND_DIR/node_modules" ]; then
    ok "后端依赖安装完成"
  else
    fail "后端依赖安装失败"
  fi
fi
info "构建原生模块 (esbuild, prisma, better-sqlite3)..."
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
  (cd "$FRONTEND_DIR" && pnpm install 2>&1) | while IFS= read -r line; do
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
  warn "首次生成出错，重试中..."
  GENERATE_OUT2=$(cd "$BACKEND_DIR" && pnpm exec prisma generate 2>&1) || true
  if echo "$GENERATE_OUT2" | grep -qi "error"; then
    fail "Prisma 客户端生成失败，请手动运行: cd backend && pnpm exec prisma generate"
    echo "$GENERATE_OUT2" | head -5 | while IFS= read -r line; do
      echo -e "    ${DIM}  $line${NC}"
    done
  else
    ok "Prisma 客户端已生成 (重试成功)"
  fi
else
  ok "Prisma 客户端已生成"
fi

# ── 9. 数据库迁移 ──
step "执行数据库迁移"
MIGRATE_OUT=$(cd "$BACKEND_DIR" && pnpm exec prisma migrate deploy 2>&1) || true
if echo "$MIGRATE_OUT" | grep -qi "error"; then
  warn "数据库迁移可能未完全成功:"
  echo "$MIGRATE_OUT" | head -6 | while IFS= read -r line; do
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
  kill_port_process "$BACKEND_PORT" || true
else
  ok "端口 $BACKEND_PORT 可用"
fi

step "检查前端端口 :$FRONTEND_PORT"
if port_in_use "$FRONTEND_PORT"; then
  kill_port_process "$FRONTEND_PORT" || true
else
  ok "端口 $FRONTEND_PORT 可用"
fi

# ════════════════════════════════════════════════════════════
#  检查结果汇总
# ════════════════════════════════════════════════════════════
echo ""
echo -e "${PURPLE}-----------------------------------------------------------${NC}"
if [ "$fail_count" -gt 0 ]; then
  echo -e "  ${RED}${BOLD}预检发现 $fail_count 个问题${NC}"
  echo -e "${PURPLE}-----------------------------------------------------------${NC}"
  echo ""
  echo -e "  ${YELLOW}是否仍然尝试启动? (y/N)${NC}"
  read -r -t 15 CONTINUE_CHOICE || CONTINUE_CHOICE="n"
  if [ "$CONTINUE_CHOICE" != "y" ] && [ "$CONTINUE_CHOICE" != "Y" ]; then
    echo -e "\n  ${DIM}已取消启动。请修复上述问题后重试。${NC}\n"
    exit 1
  fi
else
  echo -e "  ${GREEN}${BOLD}所有检查通过!${NC}"
  echo -e "${PURPLE}-----------------------------------------------------------${NC}"
fi

# ════════════════════════════════════════════════════════════
#  阶段 4：启动服务
# ════════════════════════════════════════════════════════════
header "阶段 4/4  启动服务"

# 优雅退出
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo -e "\n${YELLOW}正在停止服务...${NC}"
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  [ -n "$BACKEND_PID" ] && wait "$BACKEND_PID" 2>/dev/null
  [ -n "$FRONTEND_PID" ] && wait "$FRONTEND_PID" 2>/dev/null
  echo -e "${GREEN}所有服务已停止。再见!${NC}\n"
  exit 0
}

trap cleanup INT TERM

# 启动后端
step "启动后端服务 ${DIM}(Express + Prisma + SQLite)${NC}"
info "端口 : ${CYAN}http://127.0.0.1:$BACKEND_PORT${NC}"
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

  # 进程已退出 = 启动失败
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    break
  fi

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
done

if $BACKEND_READY; then
  ok "后端服务已就绪 ${DIM}(${WAIT_COUNT}s)${NC}"
else
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo ""
    echo -e "    ${FAIL} 后端服务启动失败!"
    echo ""
    echo -e "    ${YELLOW}常见原因及解决方法:${NC}"
    echo -e "    ${DIM}--------------------------------------------${NC}"
    echo -e "    1. 端口被占用"
    echo -e "       -> 修改 backend/.env 中的 PORT"
    echo ""
    echo -e "    2. Prisma 客户端未正确生成"
    echo -e "       -> cd backend && pnpm exec prisma generate"
    echo ""
    echo -e "    3. 数据库文件损坏"
    echo -e "       -> 删除 backend/data/dev.db 后重新迁移"
    echo ""
    echo -e "    4. 依赖缺失"
    echo -e "       -> cd backend && pnpm install"
    echo -e "    ${DIM}--------------------------------------------${NC}"
    echo ""
    echo -e "    ${YELLOW}是否仍然启动前端? (y/N)${NC}"
    read -r -t 15 CONT_FE || CONT_FE="n"
    if [ "$CONT_FE" != "y" ] && [ "$CONT_FE" != "Y" ]; then
      echo -e "\n  ${DIM}已取消。请根据上方提示修复后重试。${NC}\n"
      exit 1
    fi
  else
    warn "后端服务可能仍在启动中 ${DIM}(已等待 ${WAIT_COUNT}s)${NC}"
  fi
fi

# 启动前端
step "启动前端服务 ${DIM}(Vite + Vue 3)${NC}"
info "端口 : ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
divider

cd "$FRONTEND_DIR"
pnpm run dev &
FRONTEND_PID=$!
cd "$ROOT_DIR"

sleep 3

# ── 最终输出 ──────────────────────────────────────────────
echo ""
echo ""
echo -e "${GREEN}${BOLD}"
echo "   +---------------------------------------------------+"
echo "   |                                                   |"
echo "   |    ComputerAsset 启动成功!                        |"
echo "   |                                                   |"
echo "   |    前端地址 : http://localhost:$FRONTEND_PORT            |"
echo "   |    后端地址 : http://127.0.0.1:$BACKEND_PORT            |"
echo "   |                                                   |"
echo "   |    默认账号 : admin                               |"
echo "   |    默认密码 : admin123                             |"
echo "   |                                                   |"
echo "   +---------------------------------------------------+"
echo -e "${NC}"
echo -e "  ${DIM}提示: 按 Ctrl+C 可同时停止前后端服务${NC}"
echo ""

# 保持前台运行
wait
