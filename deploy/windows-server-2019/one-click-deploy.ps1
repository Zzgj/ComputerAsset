param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\")).Path,
  [int]$BackendPort = 3000,
  [int]$FrontendPort = 5173,
  [switch]$SkipInstall
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$DeployDir = $PSScriptRoot
$LogDir = Join-Path $DeployDir "logs"
if (!(Test-Path $LogDir)) {
  New-Item -ItemType Directory -Path $LogDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$MainLog = Join-Path $LogDir "deploy-$Timestamp.log"
$DebugNoteLog = Join-Path $LogDir "deploy-debug-note-$Timestamp.txt"

function Write-Step {
  param([string]$Message)
  $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
  Write-Host $line -ForegroundColor Cyan
  Add-Content -Path $MainLog -Value $line
}

function Run-Cmd {
  param(
    [Parameter(Mandatory = $true)][string]$Command,
    [Parameter(Mandatory = $true)][string]$WorkingDirectory
  )

  Write-Step "执行命令: $Command"
  Push-Location $WorkingDirectory
  try {
    # 使用 cmd /c 兼容 pnpm/npm/pm2 常见调用
    cmd /c $Command 2>&1 | Tee-Object -FilePath $MainLog -Append
    if ($LASTEXITCODE -ne 0) {
      throw "命令执行失败（exit=$LASTEXITCODE）：$Command"
    }
  } finally {
    Pop-Location
  }
}

function Ensure-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "未检测到命令: $Name。请先安装后重试。"
  }
}

function Ensure-BackendEnv {
  param([string]$BackendDir)
  $envPath = Join-Path $BackendDir ".env"
  if (Test-Path $envPath) {
    Write-Step "检测到 backend/.env，跳过创建。"
    return
  }

  $jwtSecret = [Guid]::NewGuid().ToString("N") + [Guid]::NewGuid().ToString("N")
  $content = @"
PORT=$BackendPort
DATABASE_URL="file:./data/dev.db"
JWT_SECRET="$jwtSecret"
JWT_EXPIRES_IN="24h"
BACKUP_DIR="backup"
"@

  Set-Content -Path $envPath -Value $content -Encoding UTF8
  Write-Step "已自动创建 backend/.env。"
}

function Save-DebugNote {
  Write-Host ""
  $note = Read-Host "可粘贴你看到的额外报错信息（可留空，直接回车）"
  if ([string]::IsNullOrWhiteSpace($note)) { return }
  Add-Content -Path $DebugNoteLog -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $note"
  Write-Step "已保存调试补充信息: $DebugNoteLog"
}

try {
  Write-Step "开始部署，项目目录: $ProjectRoot"

  $BackendDir = Join-Path $ProjectRoot "backend"
  $FrontendDir = Join-Path $ProjectRoot "frontend"

  if (!(Test-Path $BackendDir)) { throw "未找到 backend 目录: $BackendDir" }
  if (!(Test-Path $FrontendDir)) { throw "未找到 frontend 目录: $FrontendDir" }

  Ensure-Command "node"
  Ensure-Command "pnpm"
  Ensure-Command "npm"
  Ensure-Command "git"

  Write-Step "Node 版本: $(node -v)"
  Write-Step "pnpm 版本: $(pnpm -v)"

  Ensure-BackendEnv -BackendDir $BackendDir

  if (-not $SkipInstall) {
    Run-Cmd -Command "pnpm install" -WorkingDirectory $BackendDir
    Run-Cmd -Command "pnpm install" -WorkingDirectory $FrontendDir
  } else {
    Write-Step "已启用 -SkipInstall，跳过依赖安装。"
  }

  Run-Cmd -Command "pnpm prisma migrate deploy" -WorkingDirectory $BackendDir
  Run-Cmd -Command "pnpm run build" -WorkingDirectory $BackendDir
  Run-Cmd -Command "pnpm run build" -WorkingDirectory $FrontendDir

  if (-not (Get-Command "pm2" -ErrorAction SilentlyContinue)) {
    Write-Step "未检测到 pm2，开始全局安装。"
    Run-Cmd -Command "npm install -g pm2" -WorkingDirectory $ProjectRoot
  }

  # 先尝试删除旧进程（不存在时忽略）
  try { Run-Cmd -Command "pm2 delete computer-asset-backend" -WorkingDirectory $ProjectRoot } catch {}
  try { Run-Cmd -Command "pm2 delete computer-asset-frontend" -WorkingDirectory $ProjectRoot } catch {}

  Run-Cmd -Command "pm2 start dist/server.js --name computer-asset-backend --cwd `"$BackendDir`"" -WorkingDirectory $BackendDir
  Run-Cmd -Command "pm2 serve `"$FrontendDir\dist`" $FrontendPort --name computer-asset-frontend --spa" -WorkingDirectory $FrontendDir
  Run-Cmd -Command "pm2 save" -WorkingDirectory $ProjectRoot

  Write-Step "部署完成。"
  Write-Host ""
  Write-Host "后端地址: http://<服务器IP>:$BackendPort" -ForegroundColor Green
  Write-Host "前端地址: http://<服务器IP>:$FrontendPort" -ForegroundColor Green
  Write-Host "部署日志: $MainLog" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "常用排查命令：" -ForegroundColor Cyan
  Write-Host "  pm2 status"
  Write-Host "  pm2 logs computer-asset-backend --lines 200"
  Write-Host "  pm2 logs computer-asset-frontend --lines 200"
}
catch {
  Write-Host ""
  Write-Host "部署失败: $($_.Exception.Message)" -ForegroundColor Red
  Add-Content -Path $MainLog -Value "部署失败: $($_.Exception.Message)"
  Save-DebugNote
  Write-Host "请把以下日志文件发给我定位问题：" -ForegroundColor Yellow
  Write-Host "  $MainLog"
  if (Test-Path $DebugNoteLog) {
    Write-Host "  $DebugNoteLog"
  }
  exit 1
}

