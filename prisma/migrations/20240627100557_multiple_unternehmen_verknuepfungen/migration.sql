/*
  Warnings:

  - The values [Recherche,inBetreuung,Aktiv,onHold,besetzt,AbsageKunde,AbsageTOK] on the enum `AuftragStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuftragStatus_new" AS ENUM ('RECHERCHE', 'IN_BETREUUNG', 'AKTIV', 'ON_HOLD', 'BESETZT', 'ABSAGE_KUNDE', 'ABSAGE_TOK');
ALTER TABLE "public"."Auftrag" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Auftrag" ALTER COLUMN "status" TYPE "public"."AuftragStatus_new" USING ("status"::text::"public"."AuftragStatus_new");
ALTER TYPE "public"."AuftragStatus" RENAME TO "AuftragStatus_old";
ALTER TYPE "public"."AuftragStatus_new" RENAME TO "AuftragStatus";
DROP TYPE "public"."AuftragStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Auftrag" ALTER COLUMN "quelle" DROP NOT NULL,
ALTER COLUMN "quelle" DROP DEFAULT,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
