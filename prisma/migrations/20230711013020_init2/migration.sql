/*
  Warnings:

  - The `save` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[verification_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sub_type` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bathroom_maid_qty" INTEGER,
ADD COLUMN     "bedroom_maid_qty" INTEGER,
ADD COLUMN     "facilities_exterior" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "facilities_interior" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rent_period" TEXT,
ADD COLUMN     "story_qty" TEXT,
ADD COLUMN     "sub_type" TEXT NOT NULL,
ADD COLUMN     "total_room" INTEGER,
ADD COLUMN     "year_of_build" INTEGER,
ALTER COLUMN "carport_qty" DROP NOT NULL,
ALTER COLUMN "land_area" DROP NOT NULL,
ALTER COLUMN "price_per_meter" DROP NOT NULL,
ALTER COLUMN "wattage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "verification_code" INTEGER,
ALTER COLUMN "phone_number" SET DATA TYPE TEXT,
DROP COLUMN "save",
ADD COLUMN     "save" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_verification_code_key" ON "User"("verification_code");
