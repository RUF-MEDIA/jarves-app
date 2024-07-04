/*
  Warnings:

  - The values [RECHERCHE,IN_BETREUUNG,AKTIV,ON_HOLD,BESETZT,ABSAGE_TOK] on the enum `AuftragStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuftragStatus_new" AS ENUM ('Recherche', 'In_Bebtreuung', 'Aktiv', 'on_hold', 'besetzt', 'Absage_Kunde', 'Absage_TOK');
ALTER TABLE "public"."Auftrag" ALTER COLUMN "status" TYPE "public"."AuftragStatus_new" USING ("status"::text::"public"."AuftragStatus_new");
ALTER TYPE "public"."AuftragStatus" RENAME TO "AuftragStatus_old";
ALTER TYPE "public"."AuftragStatus_new" RENAME TO "AuftragStatus";
DROP TYPE "public"."AuftragStatus_old";
COMMIT;
