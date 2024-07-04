-- DropForeignKey
ALTER TABLE "public"."Auftrag" DROP CONSTRAINT "Auftrag_unternehmenId_fkey";

-- AlterTable
ALTER TABLE "public"."Auftrag" ALTER COLUMN "unternehmenId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
