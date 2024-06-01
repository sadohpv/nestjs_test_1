-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_userReport_fkey`;

-- AlterTable
ALTER TABLE `report` MODIFY `userReport` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_userReport_fkey` FOREIGN KEY (`userReport`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
