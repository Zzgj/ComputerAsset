-- CreateTable
CREATE TABLE "AssetTransferNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetId" INTEGER NOT NULL,
    "recordId" INTEGER NOT NULL,
    "fromCampusId" INTEGER NOT NULL,
    "toCampusId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssetTransferNotification_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssetTransferNotification_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "AssetRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssetTransferNotification_fromCampusId_fkey" FOREIGN KEY ("fromCampusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssetTransferNotification_toCampusId_fkey" FOREIGN KEY ("toCampusId") REFERENCES "Campus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssetTransferNotification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssetTransferNotification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetTransferNotification_recordId_recipientId_key" ON "AssetTransferNotification"("recordId", "recipientId");

-- CreateIndex
CREATE INDEX "AssetTransferNotification_recipientId_isRead_createdAt_idx" ON "AssetTransferNotification"("recipientId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "AssetTransferNotification_senderId_createdAt_idx" ON "AssetTransferNotification"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "AssetTransferNotification_assetId_idx" ON "AssetTransferNotification"("assetId");

-- CreateIndex
CREATE INDEX "AssetTransferNotification_fromCampusId_toCampusId_idx" ON "AssetTransferNotification"("fromCampusId", "toCampusId");
