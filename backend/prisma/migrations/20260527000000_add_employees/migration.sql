-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campusId" INTEGER NOT NULL,
    "departmentId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" DATETIME,
    "resignedAt" DATETIME,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmployeeResource_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN "currentEmployeeId" INTEGER REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: AssetRecord 携带 employeeId，便于调拨签字确认时精确恢复（避免按 userName 重名误匹配）
ALTER TABLE "AssetRecord" ADD COLUMN "employeeId" INTEGER REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeNo_key" ON "Employee"("employeeNo");

-- CreateIndex
CREATE INDEX "Employee_campusId_status_idx" ON "Employee"("campusId", "status");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE INDEX "Employee_name_idx" ON "Employee"("name");

-- CreateIndex
CREATE INDEX "EmployeeResource_employeeId_status_idx" ON "EmployeeResource"("employeeId", "status");

-- CreateIndex
CREATE INDEX "EmployeeResource_type_identifier_idx" ON "EmployeeResource"("type", "identifier");

-- CreateIndex
CREATE INDEX "Asset_currentEmployeeId_idx" ON "Asset"("currentEmployeeId");

-- CreateIndex
CREATE INDEX "AssetRecord_employeeId_idx" ON "AssetRecord"("employeeId");
