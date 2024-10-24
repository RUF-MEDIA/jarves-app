/*
  Warnings:

  - You are about to drop the column `test_field` on the `Auftrag` table. All the data in the column will be lost.
  - You are about to drop the column `unternehmenId` on the `Auftrag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Auftrag" DROP CONSTRAINT "Auftrag_unternehmenId_fkey";

-- AlterTable
ALTER TABLE "public"."Auftrag" DROP COLUMN "test_field",
DROP COLUMN "unternehmenId";

-- CreateTable
CREATE TABLE "public"."AuftragZuUnternehmen" (
    "auftragId" TEXT NOT NULL,
    "unternehmenId" TEXT NOT NULL,

    CONSTRAINT "AuftragZuUnternehmen_pkey" PRIMARY KEY ("auftragId","unternehmenId")
);

-- AddForeignKey
ALTER TABLE "public"."AuftragZuUnternehmen" ADD CONSTRAINT "AuftragZuUnternehmen_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "public"."Auftrag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuftragZuUnternehmen" ADD CONSTRAINT "AuftragZuUnternehmen_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
