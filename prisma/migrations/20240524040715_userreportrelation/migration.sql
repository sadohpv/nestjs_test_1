-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_userReport_fkey` FOREIGN KEY (`userReport`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
