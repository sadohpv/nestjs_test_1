/*
  Warnings:

  - Added the required column `userReport` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` ADD COLUMN `userReport` INTEGER NOT NULL;
