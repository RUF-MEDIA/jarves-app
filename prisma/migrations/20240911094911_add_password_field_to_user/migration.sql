/*
  Warnings:

  - You are about to drop the column `unternehmen_ids` on the `Ansprechpartner` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ansprechpartner" DROP COLUMN "unternehmen_ids",
ALTER COLUMN "kategorie" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Dokument" ALTER COLUMN "inhalt" DROP NOT NULL,
ALTER COLUMN "typ" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT NOT NULL;
