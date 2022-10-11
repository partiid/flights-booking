/*
  Warnings:

  - Added the required column `code` to the `Airport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_aircraft` to the `Airport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identification_number` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Airport` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_aircraft` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `identification_number` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Aircraft` (
    `id_aircraft` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(191) NOT NULL,
    `registration` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_aircraft`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Airport` ADD CONSTRAINT `Airport_id_aircraft_fkey` FOREIGN KEY (`id_aircraft`) REFERENCES `Aircraft`(`id_aircraft`) ON DELETE RESTRICT ON UPDATE CASCADE;
