-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status");

-- CreateIndex
CREATE INDEX "Asset_deviceType_idx" ON "Asset"("deviceType");

-- CreateIndex
CREATE INDEX "Asset_currentUserName_idx" ON "Asset"("currentUserName");

-- CreateIndex
CREATE INDEX "Asset_departmentId_status_idx" ON "Asset"("departmentId", "status");

-- CreateIndex
CREATE INDEX "AssetRecord_assetId_createdAt_idx" ON "AssetRecord"("assetId", "createdAt");

-- CreateIndex
CREATE INDEX "AssetRecord_userName_idx" ON "AssetRecord"("userName");
