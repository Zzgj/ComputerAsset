# Repository Guidelines

## System Overview

ComputerAsset is an enterprise computer asset management system covering stock-in, assignment, pickup, lending, return, transfer, repair, retirement, signature confirmation, employee records, Excel import/export, audit logs, and database backups. It is composed of two independent pnpm projects:

- `frontend/`: Vue 3, Vite, TypeScript, Element Plus, Pinia, Vue Router, and ECharts.
- `backend/`: Express 5, TypeScript, Prisma 7, SQLite, JWT, Zod, and Vitest.

In production, Express serves the API and the built `frontend/dist` SPA. The repository also supports Windows offline deployment packages generated from `deploy/`.

## Current Repository Baseline

The active development baseline is v1.6.2 on `refactor/stage-optimization`. Confirm the branch, upstream relationship, and worktree with `git status --short --branch` before starting work; release branches may advance independently from `main`.

## Project Structure

Frontend pages live in `frontend/src/pages`, shared controls in `components`, state in `stores`, routing and permission guards in `router`, and HTTP behavior in `services/api.ts`. Backend route modules live in `backend/src/routes`; authentication and campus-scoped RBAC are in `src/auth` and `src/middleware`. Prisma models and migrations are under `backend/prisma`. Backend tests live in `backend/tests`, while static assets live in `frontend/public`. Root `start.*` scripts coordinate development startup; `deploy/prepare.*` assembles offline deployment output.

## Architecture and Business Invariants

- Authorization is permission-key plus campus-scope RBAC. Never hard-code behavior around role names such as `admin`. New permissions must update `backend/src/auth/permissions.ts`, role metadata, frontend route `meta.permissions`, and UI visibility checks through `authStore.can()`.
- Every campus-restricted list or resource mutation must apply the helpers in `accessContext.ts`, such as `applyCampusScopeToAssetWhere` or `assertCampusAccess`, before returning or changing data.
- Asset flows must preserve `requestId` idempotency, Prisma transactions, `Asset.version` optimistic locking, `AssetRecord` creation, and `OperationLog` auditing. Reuse `runFlowOperation` or `updateAssetWithVersion` rather than directly updating an asset.
- Frontend API calls must use `apiRequest`; it injects JWT authentication and handles disabled or replaced sessions. Avoid direct `fetch` except established download/upload cases.
- Schema changes require a checked-in Prisma migration and an explicit historical-data strategy. Startup seeding in `backend/src/bootstrap/seed.ts` also performs guarded, idempotent data repairs.
- Keep `/api/excel/template` mounted directly in `app.ts`, retain the custom Vite `http-proxy-middleware` integration, and preserve the separate 2 MB JSON limit for signature confirmation.

## Build, Test, and Development Commands

Use Node.js 20.19+ or 22.12+ and pnpm 9+.

- `./start.sh`: check dependencies, migrate SQLite, and start backend and frontend.
- `cd backend && pnpm dev`: run the API in watch mode.
- `cd frontend && pnpm dev`: run Vite with `/api` proxied to port 3000.
- `cd backend && pnpm test`: run all Vitest tests.
- `cd backend && pnpm build`: compile backend TypeScript.
- `cd frontend && pnpm build`: type-check and build the SPA.
- `cd frontend && pnpm lint && pnpm format`: apply Oxlint, ESLint, and Prettier fixes. Review formatter changes before committing.
- `cd backend && pnpm prisma:migrate:dev`: create and apply a development migration.

Do not run multiple pnpm commands concurrently inside the same subproject; simultaneous dependency linking can produce transient `.bin` `ENOENT` warnings.

## Coding and Testing Conventions

Use strict TypeScript, two-space indentation, semicolon-free formatting, and a 100-character preferred line width. Name Vue components in PascalCase, composables with a `use` prefix, and functions and variables in camelCase. Name tests `*.test.ts`. Add regression coverage for backend fixes and route-level behavior when practical. Frontend and end-to-end tests are not currently configured, so document manual UI verification.

The pre-v1.6.2 baseline passed 28 backend tests, backend compilation, and frontend type checking. Existing frontend lint debt includes three Oxlint errors and 185 ESLint errors, largely historical explicit `any` usage. Do not introduce new violations, and distinguish baseline failures from changes made in the current task. There is currently no CI workflow.

## Commit, Review, and Security Guidelines

Use Conventional Commits such as `feat(frontend): ...`, `fix(deploy): ...`, `refactor: ...`, `docs: ...`, and `chore: ...`. Keep each commit focused. Pull requests should describe behavior, migration and configuration impact, verification commands, linked issues, and screenshots for UI changes.

Never commit `backend/.env`, JWT secrets, SQLite database files, backups, generated `dist/` output, or deployment packages. Production requires a strong `JWT_SECRET`, explicit CORS origins, current Prisma migrations, and verified backup retention settings.
