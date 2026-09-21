-- CreateTable
CREATE TABLE "AssetBatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batchNo" TEXT NOT NULL,
    "name" TEXT,
    "purchaseDate" DATETIME,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetCode" TEXT NOT NULL,
    "templateId" INTEGER,
    "batchId" INTEGER,
    "deviceType" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "memory" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentUserName" TEXT NOT NULL,
    "currentEmployeeId" INTEGER,
    "departmentId" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "warrantyExpiry" DATETIME,
    "remark" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Asset_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AssetTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asset_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "AssetBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asset_currentEmployeeId_fkey" FOREIGN KEY ("currentEmployeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asset_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("assetCode", "brand", "cpu", "currentEmployeeId", "currentUserName", "departmentId", "deviceType", "id", "memory", "model", "os", "purchaseDate", "remark", "serialNumber", "status", "storage", "templateId", "updatedAt", "version", "warrantyExpiry") SELECT "assetCode", "brand", "cpu", "currentEmployeeId", "currentUserName", "departmentId", "deviceType", "id", "memory", "model", "os", "purchaseDate", "remark", "serialNumber", "status", "storage", "templateId", "updatedAt", "version", "warrantyExpiry" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE UNIQUE INDEX "Asset_assetCode_key" ON "Asset"("assetCode");
CREATE UNIQUE INDEX "Asset_serialNumber_key" ON "Asset"("serialNumber");
CREATE INDEX "Asset_status_idx" ON "Asset"("status");
CREATE INDEX "Asset_deviceType_idx" ON "Asset"("deviceType");
CREATE INDEX "Asset_currentUserName_idx" ON "Asset"("currentUserName");
CREATE INDEX "Asset_currentEmployeeId_idx" ON "Asset"("currentEmployeeId");
CREATE INDEX "Asset_departmentId_status_idx" ON "Asset"("departmentId", "status");
CREATE INDEX "Asset_updatedAt_idx" ON "Asset"("updatedAt");
CREATE INDEX "Asset_batchId_idx" ON "Asset"("batchId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AssetBatch_batchNo_key" ON "AssetBatch"("batchNo");

-- CreateIndex
CREATE INDEX "AssetBatch_batchNo_idx" ON "AssetBatch"("batchNo");

-- CreateIndex
CREATE INDEX "AssetBatch_createdAt_idx" ON "AssetBatch"("createdAt");
