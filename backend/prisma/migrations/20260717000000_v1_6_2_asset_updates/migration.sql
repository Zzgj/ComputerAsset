-- Add an asset processing timestamp used by the default list ordering.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Asset" (
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
    "currentEmployeeId" INTEGER,
    "departmentId" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "warrantyExpiry" DATETIME,
    "remark" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Asset_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AssetTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asset_currentEmployeeId_fkey" FOREIGN KEY ("currentEmployeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Asset_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Asset" (
    "id", "assetCode", "templateId", "deviceType", "brand", "model", "serialNumber",
    "os", "cpu", "memory", "storage", "status", "currentUserName", "currentEmployeeId",
    "departmentId", "purchaseDate", "warrantyExpiry", "remark", "version", "updatedAt"
)
SELECT
    a."id", a."assetCode", a."templateId", a."deviceType", a."brand", a."model", a."serialNumber",
    a."os", a."cpu", a."memory", a."storage", a."status", a."currentUserName", a."currentEmployeeId",
    a."departmentId", a."purchaseDate", a."warrantyExpiry", a."remark", a."version",
    COALESCE(
        (SELECT MAX(r."actionDate") FROM "AssetRecord" r WHERE r."assetId" = a."id"),
        a."purchaseDate",
        CURRENT_TIMESTAMP
    )
FROM "Asset" a;

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

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- Backfill employee ownership on historical records where campus + employee name is unambiguous enough
-- for the existing v1.6 employee data model. Future writes always persist employeeId directly.
UPDATE "AssetRecord"
SET "employeeId" = (
    SELECT e."id"
    FROM "Employee" e
    JOIN "Department" d ON d."id" = "AssetRecord"."departmentId"
    WHERE e."name" = "AssetRecord"."userName"
      AND e."campusId" = d."campusId"
    ORDER BY e."id" ASC
    LIMIT 1
)
WHERE "employeeId" IS NULL
  AND TRIM("userName") <> ''
  AND EXISTS (
    SELECT 1
    FROM "Employee" e
    JOIN "Department" d ON d."id" = "AssetRecord"."departmentId"
    WHERE e."name" = "AssetRecord"."userName"
      AND e."campusId" = d."campusId"
  );
