-- AlterTable
ALTER TABLE "public"."Sales" ALTER COLUMN "erstelltAm" DROP NOT NULL,
ALTER COLUMN "erstelltAm" SET DEFAULT CURRENT_TIMESTAMP;
