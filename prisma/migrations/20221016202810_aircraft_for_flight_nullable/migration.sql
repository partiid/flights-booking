-- DropForeignKey
ALTER TABLE `flight` DROP FOREIGN KEY `Flight_id_aircraft_fkey`;

-- AlterTable
ALTER TABLE `flight` MODIFY `id_aircraft` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_id_aircraft_fkey` FOREIGN KEY (`id_aircraft`) REFERENCES `Aircraft`(`id_aircraft`) ON DELETE SET NULL ON UPDATE CASCADE;
