/*
  Warnings:

  - Added the required column `updatedAt` to the `LikeComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `likecomment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `img` VARCHAR(191) NOT NULL;
