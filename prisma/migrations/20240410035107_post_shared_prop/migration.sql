/*
  Warnings:

  - A unique constraint covering the columns `[sharePostId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `sharePostId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_sharePostId_key` ON `Post`(`sharePostId`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_sharePostId_fkey` FOREIGN KEY (`sharePostId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
