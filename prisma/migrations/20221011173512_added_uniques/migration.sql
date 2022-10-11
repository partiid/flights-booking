/*
  Warnings:

  - You are about to drop the column `id_aircraft` on the `Airport` table. All the data in the column will be lost.
  - You are about to drop the column `people` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_aircraft]` on the table `Aircraft` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_airport]` on the table `Airport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_city]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_country]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_flight]` on the table `Flight` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number_of_people` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_aircraft` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Airport` DROP FOREIGN KEY `Airport_id_aircraft_fkey`;

-- AlterTable
ALTER TABLE `Airport` DROP COLUMN `id_aircraft`;

-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `people`,
    ADD COLUMN `number_of_people` INTEGER NOT NULL,
    ADD COLUMN `seats` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Flight` ADD COLUMN `id_aircraft` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Aircraft_id_aircraft_key` ON `Aircraft`(`id_aircraft`);

-- CreateIndex
CREATE UNIQUE INDEX `Airport_id_airport_key` ON `Airport`(`id_airport`);

-- CreateIndex
CREATE UNIQUE INDEX `City_id_city_key` ON `City`(`id_city`);

-- CreateIndex
CREATE UNIQUE INDEX `Country_id_country_key` ON `Country`(`id_country`);

-- CreateIndex
CREATE UNIQUE INDEX `Flight_id_flight_key` ON `Flight`(`id_flight`);

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_id_aircraft_fkey` FOREIGN KEY (`id_aircraft`) REFERENCES `Aircraft`(`id_aircraft`) ON DELETE RESTRICT ON UPDATE CASCADE;
