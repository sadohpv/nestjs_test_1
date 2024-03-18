/*
  Warnings:

  - You are about to drop the column `fullName` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `fullName`,
    MODIFY `ban` ENUM('ACCOUNT', 'LIKE', 'COMMENT', 'NONE') NOT NULL;
