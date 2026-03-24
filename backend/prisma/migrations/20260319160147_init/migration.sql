-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePass" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "AssetTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "memory" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "remark" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetCode" TEXT NOT NULL,
    "templateId" INTEGER,
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
    "departmentId" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "warrantyExpiry" DATETIME,
    "remark" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Asset_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AssetTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asset_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssetRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "actionDate" DATETIME NOT NULL,
    "expectedReturnDate" DATETIME,
    "proofImage" TEXT,
    "remark" TEXT,
    "operatorId" INTEGER NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssetRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssetRecord_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssetRecord_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepairRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetId" INTEGER NOT NULL,
    "faultDescription" TEXT NOT NULL,
    "repairVendor" TEXT NOT NULL,
    "repairCost" REAL NOT NULL,
    "repairResult" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "remark" TEXT,
    CONSTRAINT "RepairRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "configKey" TEXT NOT NULL PRIMARY KEY,
    "configValue" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "operatorId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,
    "detail" JSONB NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OperationLog_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Department_sortOrder_idx" ON "Department"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AssetTemplate_name_key" ON "AssetTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetCode_key" ON "Asset"("assetCode");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_serialNumber_key" ON "Asset"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AssetRecord_requestId_key" ON "AssetRecord"("requestId");
