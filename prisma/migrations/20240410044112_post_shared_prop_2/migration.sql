-- AlterTable
ALTER TABLE `post` ADD COLUMN `sharePostId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_sharePostId_fkey` FOREIGN KEY (`sharePostId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
