-- Idempotent data fixes that previously ran on every backend startup (bootstrap/seed.ts).
-- Moved here so they execute once during migration; ensureSeed no longer needs to scan tables.
--
-- 1) Repair historical typo: status='in_user' → 'in_use'
UPDATE "Asset" SET "status" = 'in_use' WHERE "status" = 'in_user';

-- 2) Reparent 泰鼎/「信息中心」 under 综合部门 (or 综合部) when both exist as top-level dept.
-- Uses subqueries instead of joins to keep the change site-isolated.
UPDATE "Department"
SET "parentId" = (
  SELECT d2."id" FROM "Department" d2
  WHERE d2."campusId" = "Department"."campusId"
    AND d2."parentId" IS NULL
    AND d2."name" IN ('综合部门', '综合部')
  ORDER BY (CASE d2."name" WHEN '综合部门' THEN 0 ELSE 1 END), d2."id"
  LIMIT 1
)
WHERE "name" = '信息中心'
  AND "parentId" IS NULL
  AND "campusId" IN (SELECT "id" FROM "Campus" WHERE "name" = '泰鼎')
  AND EXISTS (
    SELECT 1 FROM "Department" d3
    WHERE d3."campusId" = "Department"."campusId"
      AND d3."parentId" IS NULL
      AND d3."name" IN ('综合部门', '综合部')
  );
