/*
  Warnings:

  - A unique constraint covering the columns `[id_city,name]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `City_id_city_name_key` ON `City`(`id_city`, `name`);
