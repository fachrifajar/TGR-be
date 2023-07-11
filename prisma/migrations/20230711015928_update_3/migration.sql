/*
  Warnings:

  - You are about to drop the column `Sertificate` on the `Post` table. All the data in the column will be lost.
  - Added the required column `sertificate` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "Sertificate",
ADD COLUMN     "sertificate" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "bedroom_qty" SET DATA TYPE TEXT,
ALTER COLUMN "bathroom_qty" SET DATA TYPE TEXT,
ALTER COLUMN "carport_qty" SET DATA TYPE TEXT,
ALTER COLUMN "land_area" SET DATA TYPE TEXT,
ALTER COLUMN "property_area" SET DATA TYPE TEXT,
ALTER COLUMN "price_per_meter" SET DATA TYPE TEXT,
ALTER COLUMN "wattage" SET DATA TYPE TEXT,
ALTER COLUMN "bathroom_maid_qty" SET DATA TYPE TEXT,
ALTER COLUMN "bedroom_maid_qty" SET DATA TYPE TEXT,
ALTER COLUMN "total_room" SET DATA TYPE TEXT,
ALTER COLUMN "year_of_build" SET DATA TYPE TEXT;
