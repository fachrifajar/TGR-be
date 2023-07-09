/*
  Warnings:

  - Added the required column `verification_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_code" INTEGER NOT NULL;
