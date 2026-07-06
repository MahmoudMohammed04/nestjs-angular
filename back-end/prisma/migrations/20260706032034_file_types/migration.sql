/*
  Warnings:

  - Added the required column `fileType` to the `MessageFile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMG', 'BDF');

-- AlterTable
ALTER TABLE "MessageFile" ADD COLUMN     "fileType" "FileType" NOT NULL;
