-- CreateTable
CREATE TABLE "AccessRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "bypassAll" BOOLEAN NOT NULL DEFAULT false,
    "campusesAll" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "AccessRole_slug_key" ON "AccessRole"("slug");

-- CreateTable
CREATE TABLE "AccessRolePermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    CONSTRAINT "AccessRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AccessRole" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "AccessRolePermission_roleId_key_key" ON "AccessRolePermission"("roleId", "key");
CREATE INDEX "AccessRolePermission_roleId_idx" ON "AccessRolePermission"("roleId");

-- CreateTable
CREATE TABLE "AccessRoleCampus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "campusId" INTEGER NOT NULL,
    CONSTRAINT "AccessRoleCampus_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AccessRole" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AccessRoleCampus_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "AccessRoleCampus_roleId_campusId_key" ON "AccessRoleCampus"("roleId", "campusId");
CREATE INDEX "AccessRoleCampus_roleId_idx" ON "AccessRoleCampus"("roleId");

-- 内置角色
INSERT INTO "AccessRole" ("id", "name", "slug", "description", "isSystem", "bypassAll", "campusesAll", "createdAt", "updatedAt") VALUES
(1, '超级管理员', 'super_admin', '系统内置：全部权限与数据范围', 1, 1, 1, datetime('now'), datetime('now')),
(2, '运维管理员', 'admin', '系统内置：默认全部业务权限、全部园区', 1, 0, 1, datetime('now'), datetime('now')),
(3, '只读访客', 'viewer', '系统内置：仅查看仪表盘、资产、记录与日志', 1, 0, 1, datetime('now'), datetime('now'));

-- 运维管理员：全权限（不含 bypass，由 campusesAll 管园区）
INSERT INTO "AccessRolePermission" ("roleId", "key") VALUES
(2, 'dashboard.view'),
(2, 'assets.read'),
(2, 'assets.write'),
(2, 'assets.delete'),
(2, 'records.read'),
(2, 'operations.execute'),
(2, 'templates.manage'),
(2, 'departments.manage'),
(2, 'campuses.manage'),
(2, 'excel.import'),
(2, 'excel.export'),
(2, 'backup.run'),
(2, 'users.manage'),
(2, 'roles.manage'),
(2, 'config.manage'),
(2, 'logs.read');

-- 只读访客
INSERT INTO "AccessRolePermission" ("roleId", "key") VALUES
(3, 'dashboard.view'),
(3, 'assets.read'),
(3, 'records.read'),
(3, 'logs.read');

-- RedefineTables: User.role -> User.accessRoleId
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "accessRoleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePass" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_accessRoleId_fkey" FOREIGN KEY ("accessRoleId") REFERENCES "AccessRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id", "username", "password", "realName", "accessRoleId", "isActive", "mustChangePass", "createdAt", "updatedAt")
SELECT
    "id",
    "username",
    "password",
    "realName",
    CASE "role" WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END,
    "isActive",
    "mustChangePass",
    "createdAt",
    "updatedAt"
FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE INDEX "User_accessRoleId_idx" ON "User"("accessRoleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
