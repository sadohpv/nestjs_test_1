/*
  Warnings:

  - You are about to drop the column `sharePostId` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_sharePostId_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `sharePostId`;
