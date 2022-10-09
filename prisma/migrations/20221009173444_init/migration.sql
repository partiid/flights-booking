-- CreateTable
CREATE TABLE `Flight` (
    `id_flight` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `id_departure` INTEGER NOT NULL,
    `id_destination` INTEGER NOT NULL,
    `date_departure` DATETIME(3) NOT NULL,
    `date_arrival` DATETIME(3) NOT NULL,
    `price` DOUBLE NOT NULL,

    UNIQUE INDEX `Flight_number_key`(`number`),
    PRIMARY KEY (`id_flight`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Airport` (
    `id_airport` INTEGER NOT NULL AUTO_INCREMENT,
    `id_country` INTEGER NOT NULL,
    `id_city` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_airport`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id_country` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_country`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id_city` INTEGER NOT NULL AUTO_INCREMENT,
    `id_country` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_city`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id_booking` INTEGER NOT NULL AUTO_INCREMENT,
    `date_booking` DATETIME(3) NOT NULL,
    `id_customer` INTEGER NOT NULL,
    `id_flight` INTEGER NOT NULL,
    `people` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    PRIMARY KEY (`id_booking`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id_customer` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_customer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_id_departure_fkey` FOREIGN KEY (`id_departure`) REFERENCES `Airport`(`id_airport`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_id_destination_fkey` FOREIGN KEY (`id_destination`) REFERENCES `Airport`(`id_airport`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Airport` ADD CONSTRAINT `Airport_id_country_fkey` FOREIGN KEY (`id_country`) REFERENCES `Country`(`id_country`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Airport` ADD CONSTRAINT `Airport_id_city_fkey` FOREIGN KEY (`id_city`) REFERENCES `City`(`id_city`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_id_country_fkey` FOREIGN KEY (`id_country`) REFERENCES `Country`(`id_country`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id_customer`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_id_flight_fkey` FOREIGN KEY (`id_flight`) REFERENCES `Flight`(`id_flight`) ON DELETE RESTRICT ON UPDATE CASCADE;
