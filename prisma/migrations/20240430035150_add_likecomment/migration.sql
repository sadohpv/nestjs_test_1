/*
  Warnings:

  - You are about to drop the column `comInComId` on the `likecomment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `likecomment` DROP FOREIGN KEY `LikeComment_comInComId_fkey`;

-- AlterTable
ALTER TABLE `likecomment` DROP COLUMN `comInComId`,
    ADD COLUMN `comId` INTEGER NULL,
    ADD COLUMN `commentId` INTEGER NULL;

-- CreateTable
CREATE TABLE `LikeComInCom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `comInComId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LikeComment` ADD CONSTRAINT `LikeComment_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeComInCom` ADD CONSTRAINT `LikeComInCom_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeComInCom` ADD CONSTRAINT `LikeComInCom_comInComId_fkey` FOREIGN KEY (`comInComId`) REFERENCES `ComInCom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
