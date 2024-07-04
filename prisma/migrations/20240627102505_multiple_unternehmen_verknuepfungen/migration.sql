-- DropForeignKey
ALTER TABLE "public"."Sales" DROP CONSTRAINT "Sales_unternehmenId_fkey";

-- AlterTable
ALTER TABLE "public"."Sales" ALTER COLUMN "unternehmenId" DROP NOT NULL,
ALTER COLUMN "bewerberstatus" DROP NOT NULL,
ALTER COLUMN "bewerberstatus" DROP DEFAULT,
ALTER COLUMN "erstelltAm" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
