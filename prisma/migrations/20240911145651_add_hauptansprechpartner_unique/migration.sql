/*
  Warnings:

  - A unique constraint covering the columns `[hauptansprechpartnerId]` on the table `Unternehmen` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Unternehmen" ADD COLUMN     "hauptansprechpartnerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Unternehmen_hauptansprechpartnerId_key" ON "public"."Unternehmen"("hauptansprechpartnerId");

-- AddForeignKey
ALTER TABLE "public"."Unternehmen" ADD CONSTRAINT "Unternehmen_hauptansprechpartnerId_fkey" FOREIGN KEY ("hauptansprechpartnerId") REFERENCES "public"."Ansprechpartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
