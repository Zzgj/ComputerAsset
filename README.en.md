<div align="center">

# ComputerAsset

### Enterprise Computer Asset Management System

[English](README.md) | [中文](README.zh.md)

Covers the full lifecycle of computer assets from stock-in to retirement, with visual dashboards, fine-grained access control, and complete audit trails.

[![Version](https://img.shields.io/badge/version-1.6.3-blue.svg)](https://github.com/Zzgj/ComputerAsset)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen.svg)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D.svg?logo=vue.js)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000.svg?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748.svg?logo=prisma)](https://www.prisma.io/)

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Windows Local & Server One-Click Run](#windows-local--server-one-click-run)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Asset Status Flow](#asset-status-flow)
- [Permission Model](#permission-model)
- [API Overview](#api-overview)
- [Excel Import Rules](#excel-import-rules)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Screenshots
<img width="1920" height="919" alt="6f46b0aac925df5dc872d96a1b4a6e6a" src="https://github.com/user-attachments/assets/c8690746-31ba-4e9c-a10a-b3062148f2cf" />
<img width="1920" height="919" alt="4808d898e3d43bae25eb7416c9fae4d3" src="https://github.com/user-attachments/assets/bad4d7fd-15c1-4412-bf09-a290dc568c7d" />
<img width="1920" height="919" alt="8f73e9ae716c360bc5f493a3303e27c5" src="https://github.com/user-attachments/assets/a389ed42-3e31-40ed-9aa3-8134b51a6126" />

---

## Features

### Full Lifecycle Asset Management

- **Stock-in Management** — Supports auto-fill from device templates and bulk Excel import
- **Batch Management** — Tag a set of computers stocked in together as a single batch (auto-generated batch number `BAT-YYYYMM-NNN`) for later traceability
- **Check-out / Assignment** — Direct check-out or assign as pending pickup; after confirming pickup, a QR code scan is required to sign the handover form
- **Borrow / Return** — Complete borrow and return workflow
- **Transfer** — Cross-department / cross-campus asset transfers, with QR code signature confirmation and cross-campus message notifications
- **Maintenance Management** — Send for repair / mark repair complete, with repair result recording
- **Retirement** — Asset retirement and decommissioning registration
- **Manual History Entry** — Manually add historical user records (useful when Excel-imported data lacks complete transfer history)
- **Precise Filtering** — Asset list supports multi-status, campus-linked department tree, and parent departments that include all sub-departments

### Visual Dashboard

- Total asset count and status distribution charts
- Department asset distribution overview
- Three types of expiration reminders (overdue borrows / expiring soon / pickup timeout), with clickable numbers that jump to asset details
- "Multiple assets under one person" risk indicator

### Audit & Traceability

- Stock-in/out record queries (with pagination, search, and date range filtering)
- Complete operation logs (summary + structured detail popup), grouped by business category
- Asset detail timeline (includes all historical transfers and before/after values of key information changes; manual entries are distinguished with orange nodes)
- "Previous Users" cards automatically aggregate everyone who has historically used the asset
- Employee details retain historically held computers; assets can still be traced by employee after return
- Employee renames automatically sync to asset records and transfer history

### System Management

- **Role Permissions** — Fine-grained RBAC based on permission keys + campus scope (default `super_admin` / `admin` / `viewer`, customizable)
- **User Management** — Account creation, deactivation, password reset; accounts with audit history can only be deactivated, not physically deleted
- **Department Management** — Organizational structure maintenance
- **Device Templates** — Model template management with associated asset count statistics
- **System Configuration** — One-person-one-machine policy, reminder days, etc.
- **Data Backup** — SQLite database file download backup with automatic count-based rotation
- **Excel Import/Export** — Bulk data operations with pre-validation and invalid row analysis
- **Health Checks** — Dual probes: `/api/health/live` (process alive) and `/api/health/ready` (includes DB liveness check)

---

## Tech Stack

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Frontend Framework** | Vue 3 + TypeScript | Composition API, type-safe |
| **Build Tool** | Vite 7 | Fast HMR, efficient builds |
| **UI Components** | Element Plus | Enterprise-grade Vue 3 component library |
| **Charts** | ECharts + vue-echarts | Data visualization |
| **State Management** | Pinia | Next-generation Vue state management |
| **Routing** | Vue Router 5 | Route-level permission guards |
| **Backend Framework** | Express 5 | High-performance Node.js web framework |
| **ORM** | Prisma 7 | Type-safe database access layer |
| **Database** | SQLite | Zero-config, embedded relational database |
| **Authentication** | JWT + bcryptjs | Stateless token auth, hashed password storage |
| **Code Quality** | ESLint + Oxlint + Prettier | Multi-level linting and formatting |
| **Package Manager** | pnpm | Efficient disk usage, strict dependency management |

---

## Project Structure

```text
ComputerAsset/
├── frontend/                     # Frontend application
│   ├── src/
│   │   ├── main.ts               # Application entry
│   │   ├── App.vue               # Root component
│   │   ├── router/               # Route configuration (with permission guards)
│   │   ├── stores/               # Pinia state stores
│   │   ├── pages/                # Page components
│   │   │   ├── BatchesPage.vue   # Batch management
│   │   │   └── ...
│   │   ├── components/           # Shared components
│   │   └── services/api.ts       # API request wrapper
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Backend API service
│   ├── src/
│   │   ├── server.ts             # Server startup entry
│   │   ├── app.ts                # Express app configuration
│   │   ├── prisma.ts             # Prisma client instance
│   │   ├── routes/               # Route modules
│   │   │   ├── batches.ts        # Batch management
│   │   │   └── ...
│   │   ├── middleware/           # Middleware (auth, permissions)
│   │   ├── auth/                 # Authentication logic
│   │   ├── bootstrap/seed.ts     # Initial data seeding
│   │   └── utils/                # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma         # Database model definitions
│   │   └── migrations/           # Database migration files
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── deploy/                   # Windows offline deployment: prepare, deploy, stop, restart
├── start.sh                  # One-click startup script (macOS / Linux)
├── start.bat                 # One-click startup script (Windows)
├── stop.bat                  # Stop the process listening on the PORT in backend/.env (local dev)
├── restart.bat               # Runs stop.bat without pause, then start.bat
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.19.0 (LTS recommended)
- [pnpm](https://pnpm.io/) >= 9 (recommended: enable via `corepack enable`)

### 1. Clone the Repository

```bash
git clone https://github.com/Zzgj/ComputerAsset.git
cd ComputerAsset
```

### 2. One-Click Start (Recommended)

The project provides a one-click startup script that automatically performs environment checks, dependency installation, database migration, and service startup:

**macOS / Linux:**

```bash
./start.sh
```

**Windows (double-click or command line):**

```cmd
start.bat
```

The startup script performs the following visual checks in sequence:

| Stage | Check Items |
|-------|------------|
| Environment | Node.js version, pnpm installation, project directory, network connectivity |
| Dependencies & Config | `.env` config file, backend/frontend dependencies, database migration |
| Port Check | Whether backend port 3000 and frontend port 5173 are in use |
| Start Services | Backend → wait for ready → frontend → output access URL |

After all checks pass, both frontend and backend start simultaneously. Press `Ctrl+C` to stop all services at once.

### 3. Manual Start (Optional)

To start frontend and backend separately:

**Start the backend:**

```bash
cd backend
cp .env.example .env          # Copy env vars on first run
pnpm install                  # Install dependencies
pnpm exec prisma migrate deploy   # Run database migrations
pnpm run dev                  # Start dev server
```

Backend default URL: `http://127.0.0.1:3000`

**Start the frontend:**

```bash
cd frontend
pnpm install                  # Install dependencies
pnpm run dev                  # Start dev server
```

Frontend default URL: `http://localhost:5173`

> In dev mode, frontend `/api` requests are automatically proxied to the backend service.

### 4. Log In

On first startup, the system automatically creates a default admin account:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |
| Role | `super_admin` |

> **Security Reminder**: This default account is for development and testing only. Be sure to change the password before deploying to production.

---


## Windows Local & Server One-Click Run

This repository can be used for daily development on a **Windows dev machine**, and can also run on a **server with only Node.js installed** via the deployment package (formerly the `deploy/windows-server` branch capability, now merged into `main`).

### Repository Root (Local Development, Requires pnpm)

| Script | Description |
|--------|-------------|
| `start.bat` / `start.sh` | One-click: check environment, install dependencies, migrate database, and start backend (3000) + frontend Vite (5173) |
| `stop.bat` | Kills the process listening on the **backend port** (default `3000`, reads `PORT=` from `backend\\.env`) to free the port for restart |
| `restart.bat` | Runs `stop.bat` (no pause), then `start.bat` |

> In dev mode, frontend and backend run in separate windows; `stop.bat` only handles the **backend port**. If the frontend Vite still occupies port 5173, close it in the corresponding window or end it via Task Manager.

### Deployment Package Directory `deploy-package/` (Intranet Server, No pnpm Needed)

On a machine with internet access, run `deploy\\prepare.bat` or `bash deploy/prepare.sh` from the repository root to generate `deploy-package/`. Copy it to the server, then:

| File | Description |
|------|-------------|
| `deploy.bat` | Checks environment, initializes `.env`, migrates database, and starts the service (production mode: backend serves `frontend/dist`) |
| `stop.bat` | Stops the service on the port used by the current deployment package |
| `restart.bat` | Runs `stop.bat` then `deploy.bat` (commonly used after modifying `backend\\.env`) |

See **`deploy/README.txt`** in the same directory for plain-text instructions.

---

## Environment Variables

Backend environment variables are configured via the `backend/.env` file, referencing `.env.example`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend service port |
| `DATABASE_URL` | `file:./data/dev.db` | SQLite database file path |
| `JWT_SECRET` | — | JWT signing secret (**must change in production**) |
| `JWT_EXPIRES_IN` | `24h` | JWT token expiration time |
| `BACKUP_DIR` | `backup` | Database backup directory (relative to backend/) |
| `BACKUP_RETENTION_COUNT` | `30` | Number of automatic backups to retain; 0 = no cleanup |
| `EXCEL_IMPORT_MAX_MB` | `20` | Excel import file size limit (MB); set to `0` for no limit |
| `TRUST_PROXY` | `loopback` | Real client IP resolution strategy behind reverse proxy; see Express trust proxy docs |
| `SLOW_QUERY_MS` | `200` | Prisma slow query threshold (ms), dev only; 0 = disabled |
| `LOG_LEVEL` | dev=`debug` / prod=`info` | Log level: debug / info / warn / error |
| `AUTO_MIGRATE` | — | Set to `1` to auto-run `prisma migrate deploy` on startup (only when starting directly via `node dist/server.js` and deploy script hasn't migrated first) |
| `external_base_url` | — | External network access URL (set in System Configuration); when set, signature QR codes can switch to external mode |

> `external_base_url` is managed via the System Configuration page and stored in the `SystemConfig` table, not in the `.env` file.

Frontend dev environment can configure the API proxy target in `frontend/.env.development`:

```env
VITE_API_PROXY_TARGET=http://127.0.0.1:3000
```

When building the **Windows offline deployment** package, signature QR codes / copy signature links default to using the browser's current access URL. For example, if you open the system via `http://10.2.254.29:3000`, the QR code will automatically use that address. To fix it to a domain or reverse proxy address, edit **`VITE_PUBLIC_BASE_URL`** in **`frontend/env.deployment`** (e.g., `https://assets.example.com`). When running `deploy/prepare.bat` or `deploy/prepare.sh`, it will be copied to `frontend/.env.production.local` before building the frontend. See [Production Deployment](#production-deployment).

---

## Production Deployment

### Option 1: Build Locally and Run with Node Directly (For Existing Ops Infrastructure)

```bash
# Build frontend
cd frontend
pnpm run build                # Output to frontend/dist/

# Build backend
cd backend
pnpm run build                # Output to backend/dist/
```

```bash
cd backend
pnpm exec prisma migrate deploy   # Ensure database schema is up to date
pnpm run start                    # Start production server (serves frontend/dist by default, see backend/src/app.ts)
```

> **Deployment Recommendations**:
> - Use a reverse proxy (e.g., Nginx) to unify frontend static files and backend API under the same domain
> - Guard the backend process with PM2 or systemd
> - Set a strong `JWT_SECRET` in production
> - Regularly back up the SQLite database file via the built-in system feature

### Option 2: Windows Offline Deployment Package (Intranet, Node.js Only)

Suitable for **Windows Server** or environments where pnpm cannot be installed: clone this repository on a machine with internet access, run **`deploy\prepare.bat`** (Windows) or **`bash deploy/prepare.sh`** (macOS/Linux) to generate the **`deploy-package/`** folder, copy it to the target machine, and double-click **`deploy.bat`**.

| Step | Content |
|------|---------|
| Check Environment | Verify Node.js (>= 20) |
| Install & Build | Backend `pnpm build`, frontend `pnpm build`; use **npm** to install backend production deps in the package |
| Assemble | Copy `backend/dist`, `frontend/dist`, Prisma migrations and scripts to `deploy-package/` |
| Frontend Variables | If **`frontend/env.deployment`** exists, it's copied to **`frontend/.env.production.local`** before build to inject `VITE_PUBLIC_BASE_URL` |

#### Signature Links & QR Codes: Auto-Follow Access URL

QR codes and "Copy Signature Link" after check-out/borrow default to using the current browser access URL. For example, if the server IP is `10.2.254.29` and you access `http://10.2.254.29:3000` from a LAN computer, the generated QR code will be `http://10.2.254.29:3000/sign?...`.

To fix it to a domain or reverse proxy address:

1. Edit **`VITE_PUBLIC_BASE_URL`** in **`frontend/env.deployment`** (no trailing `/`; port must match the actual access port).
2. After modifying, re-run **`deploy/prepare.bat`** or **`deploy/prepare.sh`**, then copy the new `deploy-package` to the server and run **`deploy.bat`**.

Daily server operations: `stop.bat` to stop the service, `restart.bat` to stop then start. For more details, see **`deploy/README.txt`** and [Windows Local & Server One-Click Run](#windows-local--server-one-click-run).


---

## Asset Status Flow

```text
┌──────┐    分配     ┌────────┐   确认领用   ┌────────┐   签字   ┌───────┐
│ 在库 │ ──────────▶ │ 待领用 │ ──────────▶ │ 待签字 │ ──────▶ │ 使用中 │
└──┬───┘             └────┬───┘              └────────┘          └───┬───┘
   │                      │ 取消分配                                  │ 归还
   │                      ▼                                          │
   │                    在库                                         ▼
   │   直接出库 / 借出 ─────▶ 待签字 ──────▶ 使用中 / 借用中 ──────▶ 在库
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

> Status labels: 在库 = In Stock · 待领用 = Pending Pickup · 待签字 = Pending Signature · 使用中 = In Use · 借用中 = Borrowed · 维修中 = Under Repair · 已报废 = Retired

---

## Permission Model

The system includes three built-in roles; actual authorization is based on permission keys and campus scope:

| Module | super_admin | admin | viewer |
|--------|:-----------:|:-----:|:------:|
| Dashboard / Asset List / Asset Detail / View Records | ✅ | ✅ | ✅ |
| Stock-in / Check-out / Borrow / Return / Transfer / Repair / Retire | ✅ | ✅ | ❌ |
| Department Management / Device Template Management / Import/Export | ✅ | ✅ | ❌ |
| User Management / Role Management / System Config / Data Backup | ✅ | ✅ | ❌ |
| Delete Assets / Clear Manual History | ✅ | ✅ (requires `assets.delete`) | ❌ |
| Batch Management (create/edit/delete) | ✅ | ✅ (requires `batches.manage`) | ❌ |
| Edit Key Asset Info (ID / Serial No / Brand etc.) | ✅ (requires secondary confirmation) | ✅ | ❌ |

---

## API Overview

All endpoints are prefixed with `/api`. Main groups:

| Route Prefix | Description |
|-------------|-------------|
| `/api/auth` | Authentication (login / logout / token refresh) |
| `/api/assets` | Asset CRUD |
| `/api/batches` | Asset batch management |
| `/api/operations` | Business operations (check-out, borrow, return, transfer, repair, retire, manual history entry, etc.) |
| `/api/dashboard` | Dashboard statistics |
| `/api/records` | Stock-in/out records |
| `/api/logs` | Operation logs |
| `/api/templates` | Device template management |
| `/api/departments` | Department management |
| `/api/users` | User management |
| `/api/roles` | Role management |
| `/api/config` | System configuration |
| `/api/excel` | Excel import/export |
| `/api/backup` | Database backup |
| `/api/transfer-notifications` | Cross-campus transfer messages |
| `/api/health` `/api/health/live` `/api/health/ready` | Health checks (live = process only; ready = includes DB) |

---

## Excel Import Rules

### Basic Rules

- Only the first worksheet of the Excel file is read
- Blank trailing rows are automatically ignored
- **Computer ID** is a required field; missing values cause the row to be flagged as invalid and skipped

### Template Matching

1. First, exact match by "Template Name" against registered templates
2. If no match, match by "Brand + Model" combination
3. Unregistered models prompt a choice: create a template and import, or import the asset only

### Data Validation

| Validation Item | Rule |
|----------------|------|
| Status & Personnel | "Current User" is required for Pending Pickup / In Use / Borrowed statuses; automatically cleared for In Stock |
| Serial Number Uniqueness | Cannot duplicate within the same batch; cannot conflict with existing assets in the database; blank values auto-fill as `暂无-电脑编号` |
| Date Format | Invalid purchase date or warranty expiry date causes the row to be flagged as invalid and skipped |

### Pre-Validation

Before importing, the system performs a pre-validation showing detected count, importable count, invalid count, as well as grouped statistics and details of invalid reasons (row number + reason). Invalid rows are automatically skipped during the actual import.

---

## Changelog

### v1.6.3

**New Features**
- Asset batch management — tag a set of computers stocked in together as a single batch for later traceability (auto-generated batch number `BAT-YYYYMM-NNN`)
- Stock-in registration, asset detail editing, and asset list filtering all support batch selection
- System configuration supports setting an external network URL; signature QR codes can switch between internal/external network modes
- Mobile signature page supports fullscreen signature mode for a larger writing area

**Fixes & Improvements**
- Employee renames now automatically sync to asset current user name and transfer history old names
- Version announcements now include full history from v1.0.0 through v1.4.5

### v1.6.2

**New Features**
- Employee offboarding page adds one-click return of all held assets, bulk returning to each campus's "Unassigned" department with complete audit logs
- Employee details add historically held assets; after return, you can still view the computer, department at the time, and most recent association date
- Admins with `assets.delete` permission can delete all business data of an erroneous asset, or only clear manual history entries

**Workflow & UX Improvements**
- Pending Pickup assets enter "Pending Signature" after clicking "Confirm Pickup"; a QR code is displayed; the asset enters "In Use" only after signing the handover form
- Asset list defaults to descending order by most recent processing time, supports multi-status simultaneous filtering
- Department filter changed to campus-linked department tree; selecting a parent department automatically includes all sub-departments
- Quick-create employee campus context is now determined by the target department; the page clearly indicates the switch method

**Fixes**
- Deleting a user with existing business records now clearly indicates audit foreign key protection and the deactivation method, no longer exposing Prisma errors to the frontend

### v1.6.1

**Fixes**
- Quick-create employee dialog did not lock the current operating campus; cross-campus selection caused subsequent submissions to be rejected by `assertEmployeeAccess` and corrupted employee data
- Original signature image lost after signature reset: the new `signature_reset` record now preserves the original `proofImage`; asset detail timeline shows it as "Original Pickup Signature (Voided)"
- Route guard forcibly logged out on network jitter / 5xx errors: now only logs out on 401; other errors reuse cached `me` to continue rendering
- Version announcement drawer only showed the latest 5 historical versions: changed to show full history

### v1.6.0

**New Features**
- Employee management module: new employee profiles (employee ID, name, campus/department, status), supporting create, edit, and cross-campus transfer
- Employee external resource records: SIM cards / email / domain accounts / badges / access cards / workstations, etc., unified active / closed status tracking
- Employee offboarding: aggregate external resource closure selection + unreturned IT asset list prompt + forced completion + full operation log audit trail
- Check-out / Borrow / Transfer page employee selector: dual mode (in-campus employee remote search + quick-create when not found)
- Asset details and list show employee links, one-click jump to employee detail page
- Historical data auto-backfill to employee profiles (first startup auto-generates `AUTO-{n}` employee numbers from `Asset.currentUserName`, all assigned to Taiding)
- Transfer private handover reminder: transfer dialog and signature confirmation page add red text banner; signature page adds "I acknowledge" checkbox
- Signature reset feature: IT staff can "re-sign" signed records from asset detail page; original signature voided, asset returns to Pending Signature state
- Version upgrade announcements: sidebar bell icon + red dot reminder, popup showing latest 5 version updates, read status stored in localStorage

**Fixes**
- Custom roles showed "Manual History Entry" button but couldn't use it (button now requires both `assets.write` + `operations.execute`)
- Password change API allowed all-whitespace passwords (added trim + length validation)
- `manual-record` endpoint missing campus permission check for target department

### v1.5.3

**Fixes**
- `deploy.bat`'s `MIGRATE_EXIT` check was reset to 0 by `set` in `enabledelayedexpansion` mode, causing migration failure to report `[OK] Migration done` and success to report `[FAIL]`; changed to use `errorlevel` directly
- `deploy.bat` troubleshooting checklist added "Windows TEMP directory missing" scenario (e.g., `C:\Users\...\Temp\2` not existing causing Prisma CLI startup crash)
- Transfer message page tab switching caused navbar flicker due to mutual exclusion between `el-empty` and `el-table`; changed to use `el-table`'s `#empty` slot for unified overlay

### v1.5.2

**Fixes**
- Deploy script `deploy/package-scripts/deploy.bat`: Prisma migrate failure no longer silently swallowed as WARN; shows specific troubleshooting direction and asks whether to continue startup; avoided the misleading "deploy appears successful, runtime missing table 500" scenario
- Documentation: when upgrading the offline deployment package, if old `data/dev.db` exists but migrations are incomplete, manually run `node node_modules/prisma/build/index.js migrate deploy` to complete them

### v1.5.1

**Fixes**
- Fixed misplaced manual entry records in the transfer history timeline: stock-in records now sort by `asset.purchaseDate`, so stock-in records with "purchase date earlier than manual entry date" correctly appear below manual entries

### v1.5.0

**Architecture Refactor (Six-Phase Progressive Delivery)**

Focused on robustness, performance, and maintainability. All changes preserve business functionality and API contracts; each phase is independently verifiable and rollbackable.

**Phase 1 — Foundation Hardening & Observability**
- `app.set('trust proxy')`: `OperationLog.ipAddress` reflects real client IP behind reverse proxy
- Request-wide `X-Request-Id` injection and writeback, cross-log/frontend trace correlation
- Lightweight structured logging (dev text / prod JSON), errorHandler 5xx unified reporting
- `/health/live`, `/health/ready`, `/health` three-tier health checks (including DB liveness)
- Backup directory rotation by `BACKUP_RETENTION_COUNT` (default 30 retained)
- Prisma slow query logging (dev only, >200ms warns)

**Phase 2 — Data Layer Correctness**
- Added 6 query indexes: `Asset` status/deviceType/currentUserName/(departmentId,status); `AssetRecord` (assetId,createdAt)/userName
- High-frequency queries switched from `SCAN` to `SEARCH USING INDEX`
- `in_user` typo fix + Taiding department reassignment migrated to SQL migration, no longer full-table scan on startup
- `splitParenNamedDepartments` made one-time via `SystemConfig` marker
- `AUTO_MIGRATE=1` startup fallback (direct `node dist/server.js` also auto-migrates)
- Tiered JSON body limits: global 256KB, signature endpoints 2MB

**Phase 3 — Performance & Flow Abstraction**
- Department path in-process cache (`getDepartmentPathSnapshot`), reused by 9 routes, invalidated at 5 write points
- `requireAuth` LRU cache for sessionToken (10s TTL, max 2000), significantly reducing DB roundtrips per protected request
- `runFlowOperation` higher-order function consolidates 7 simple flow endpoints, operations.ts 1056→761 lines
- Dashboard borrow/pending-pickup notifications merged into single query (`include: { records: { take: 1 } }`)
- Also fixed bug where old token still worked after logout

**Phase 4 — Type & Validation Convergence**
- `HttpError` class + static factories (badRequest/unauthorized/forbidden/notFound/conflict)
- `Express.Request` type extension (access/auth/requestId) eliminating `(req as any)`
- Introduced zod + `validate` middleware, covering 11 auth and operations endpoints
- errorHandler recognizes ZodError → 400 + `VALIDATION_FAILED` + field-level details
- Introduced vitest, 28 unit tests covering pure functions + HttpError + LRU cache

**Phase 5 — Frontend Experience**
- Route lazy loading: 15 of 19 pages switched to dynamic import, 14 independent chunks split out
- `useApi` composable: unified loading + ElMessage error handling boilerplate
- `fetchMe` 5-minute cache: route switching no longer repeatedly requests `/api/auth/me`

**Phase 6 — Dashboard Notifications & Manual History Entry**
- Dashboard three notification types (overdue / expiring soon / pickup timeout) all expanded with detail tables; computer IDs are clickable to jump to asset details
- Asset detail page transfer history card adds "Manual History Entry" feature, allowing manual entry of historical user records pre-Excel-import
- Added `AssetRecordAction.manual_note` enum value; timeline distinguishes manual entries with orange nodes + labels
- Previous Users card automatically reflects manual entry data

### v1.4.5

**Cross-Campus Transfer Message Notifications**
- New transfer message center, supporting "Received" and "Sent" cross-campus transfer notification views
- In-use asset transfers and in-stock asset transfers automatically notify the target campus asset admin when crossing campuses
- Recipients can mark as read; senders can track recipient and read time, reducing handover disputes
- Auto-reminder of unread cross-campus transfer messages after login; sidebar shows unread count
- Transfer target department selection supports cross-campus while retaining source asset campus permission checks

### v1.4.4

**Asset Transfer & Audit Enhancement**
- Asset transfer operations add optimistic locking to prevent mutual overwrites when multiple people operate the same asset simultaneously
- New in-stock transfer entry, supporting direct cross-campus/department reassignment of in-stock computers
- Signature confirmation adds completed status check; refreshing or reopening the signature page shows "link expired"
- Asset remarks included in key information change logs; transfer history shows specific before/after modification content
- Return registration statistics changed to count by filter criteria, no longer just the current page
- Optimized dashboard one-person-multiple-assets display and operation log detail Chinese readability

### v1.4.3

**Transfer Signature**
- After transfer submission, the asset enters "Pending Signature Confirmation"; the new user scans the QR code to sign and confirm, then the record is finalized (updates user, target department); asset details support post-transfer QR code popup and copy signature link
- Signature page supports `kind=transfer` to display "Transfer Confirmation" text

### v1.4.2

**Repository Unification**
- Merged deployment scripts, production static hosting, and documentation from the former `deploy/windows-server` branch into **`main`**, maintaining both development and deployment capabilities in a single branch.

**Deployment & Intranet Experience**
- Deployment build injects `VITE_PUBLIC_BASE_URL` (see `frontend/env.deployment`); signature links and QR codes point to an accessible server address.
- Production build disables Vue DevTools, removes Google Fonts external links; clipboard copy adds fallback.
- Root directory and deployment package add **`stop.bat`**, **`restart.bat`** for easy Windows service stop and restart.

**Features & UI**
- Stock-in device type and model management custom types aligned; sidebar and login page show version number.

### v1.4.1

**Bug Fixes & Feature Enhancements**
- Fixed device template custom device type saving issue showing `deviceType is invalid` (backend relaxed enum validation)
- After check-out/borrow, asset status changed to "Pending Signature Confirmation"; the assignee/borrower scans the QR code to sign, then it automatically transitions to "In Use" or "Borrowed"
- Signature page changed to a standalone page without sidebar and navigation, avoiding interference with the main account
- Borrow operation adds QR code signature confirmation, consistent with the check-out flow
- Asset detail page transfer records show handwritten signature images; unsigned check-out/borrow records are labeled "Unsigned Confirmation"
- Added `pending_confirmation` (Pending Signature Confirmation) asset status; asset list supports filtering by this status

### v1.4.0

**Check-out Signature Confirmation**
- Direct assignment check-out auto-generates a QR code; the assignee scans it to enter the signature page
- Signature page displays complete handover information (asset ID, assignee, department, time, remarks)
- Handwritten signature pad supports mouse and touch; signature stored as an image attached to the transfer record
- Supports copying the signature link, shareable via WeChat, etc.

**Single Account Login Limit**
- Same account can only be logged in at one place at a time; new login automatically kicks the old session
- Kicked-out users are redirected to the login page with "Logged in on another device" prompt
- Logout clears the session token

**Dashboard Enhancement**
- Statistics cards (Total / In Stock / In Use / Borrowed) click to jump directly to the asset list filtered by status

**Borrow Return Time**
- Borrowed assets show expected return date hint on the detail page
- Transfer timeline borrow records mark the expected return date

**Previous User Search**
- Asset list adds "Previous User Search" to find people who have historically used an asset
- Supports fuzzy matching, useful for tracking devices of departed employees

**Return Registration Pagination**
- Return registration page changed from fixed 100 rows to pagination (20/50/100 selectable), showing total count

**Role Management Audit**
- Create, edit, and delete role operations all write to the operation log

**Device Template Optimization**
- Device type supports custom input (preset options retained, custom types also accepted)
- Removed sort number field, simplifying template management

**Search Fix**
- Fixed asset list Chinese search not responding (IME composition input not triggering search)

### v1.3.0

**Device Type & Stock-in**

- Device type adds "Other", aligned with the backend Prisma enum; template search supports "Other / other" keyword
- Stock-in page supports selecting device type first; model template is now optional; brand, model, OS, CPU, memory, storage can be manually entered
- Under "Other" type, brand and model can be empty; non-Other types still validate brand and model
- Asset ID generation supports device-type-specific prefixes (e.g., Laptop/Desktop `PC`, All-in-One `AIO`, Server `SRV`, Other `OTH`)
- Wording unified to "Asset ID"; duplicate stock-in prompts, list filtering, and route query params are linked

**Asset List**

- Added filter by device type
- Added "Column Settings": show/hide device type, brand, model, serial number, status, user, campus, department, device template columns; preferences saved in the local browser

**Campus Management**

- Super admin can add new campuses and delete the current campus (validates associated assets, departments, and role campus scopes before deletion)
- Department management page shows all campuses (no longer limited to a few entries)

**Role Management**

- New roles get a unique `slug` auto-assigned by the backend, no manual input needed
- Role list "Campus Scope" shows specific campus names

**Asset Details**

- Template association is only unlinked when brand, model, OS, CPU, memory, storage, and other template-related fields change; changing only the ID or serial number no longer forces unlink

**Upgrade Notes**

- This version extends the device type enum; when upgrading, run Prisma migration in the `backend` directory (dev: `pnpm exec prisma migrate dev` to generate and apply; production: `pnpm exec prisma migrate deploy` with existing migration files)

### v1.2.0

**All-New UI Design**
- Established a global CSS design system (Indigo/Violet primary palette, Inter font, unified shadows/border-radius/animations)
- Login page redesigned as a split layout: left brand display panel + right login form
- Sidebar dark gradient theme (user avatar, glowing nav indicator, SVG icon buttons)
- Dashboard four-color gradient stat cards, donut chart, unified color bar chart
- All 16 pages unified title style, entrance animations, card spacing, table header style
- Introduced Element Plus Chinese language pack

**One-Click Startup Scripts**
- Added `start.sh` (macOS/Linux) and `start.bat` (Windows)
- Four-stage visual pre-check: environment, dependencies, ports, service startup
- Port conflict auto-detection of occupying process with termination prompt
- Backend startup failure shows troubleshooting guide
- Prisma generation failure auto-retry
- Ctrl+C graceful stop of all services

**Idle Auto-Logout**
- 10 minutes of inactivity auto-logs out, ensuring account security
- 60-second warning dialog before logout (animated clock + countdown)
- User can click "Continue" to reset the timer
- Activity events throttled at 2 seconds to avoid high-frequency triggers

**Code Quality Improvements**
- API layer adds 401 auto-redirect to login, response parsing tolerance
- Route guard `await logout()` fixes race condition; shows prompt on insufficient permissions
- Dashboard, check-out page, asset detail page add error handling and loading states
- Asset detail validates invalid IDs, preventing NaN requests
- Backend CORS supports whitelist configuration (`CORS_ORIGINS` env var)
- JSON body limit reduced from 20MB to 2MB (Excel uses multipart, unaffected)
- Server adds SIGINT/SIGTERM graceful shutdown
- Password reset log no longer records plaintext password

**Other**
- Introduced Windows Server offline deployment scripts and `deploy-package` workflow (later unified with `main` in v1.4.2)
- README.md fully rewritten, adding badges, table of contents, deployment guide, contribution guidelines
- Added `pnpm-workspace.yaml` pre-configuring native module build permissions

### v1.1.x

**Import/Export Enhancement**
- Import pre-validation adds statistics prompt (detected / valid / invalid)
- Added invalid reason grouped statistics and row-level detail display
- Fixed false "missing computer ID" on blank trailing rows
- Serial number conflict rows auto-skipped, no longer failing the entire batch
- Added status-personnel linkage validation

**Template & Asset Association**
- Device template page adds "Associated Asset Count" column
- Asset list and details show device template source (template name / custom)
- Manual key information changes auto-unlink template association

**Record & Log Optimization**
- Stock-in/out records support pagination and multi-dimensional search
- Operation logs changed to summary + detail popup structured display
- Asset timeline supports showing before/after values of key information changes

**High-Privilege Asset ID Change Flow**
- Key information edit permission consolidated to `super_admin`
- High-risk confirmation prompt added before editing
- Detail changes written to operation log, supporting audit traceability

---

## Contributing

Issues and Pull Requests are welcome to help improve the project.

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Create a Pull Request

**Commit Convention** — recommended to follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation update |
| `style` | Code formatting (no logic change) |
| `refactor` | Refactoring |
| `chore` | Build / toolchain changes |

---

## License

This project is released under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

**[⬆ Back to Top](#computerasset)**

</div>
