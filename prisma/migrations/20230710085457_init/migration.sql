/*
  Warnings:

  - Added the required column `sub_type` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bathroom_maid_qty" INTEGER,
ADD COLUMN     "bedroom_maid_qty" INTEGER,
ADD COLUMN     "facilities_exterior" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "facilities_interior" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rent_period" TEXT,
ADD COLUMN     "story_qty" TEXT,
ADD COLUMN     "sub_type" TEXT NOT NULL,
ADD COLUMN     "total_room" INTEGER,
ADD COLUMN     "year_of_build" INTEGER,
ALTER COLUMN "carport_qty" DROP NOT NULL,
ALTER COLUMN "wattage" DROP NOT NULL;
