/*
  Warnings:

  - A unique constraint covering the columns `[id_country,name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Country_id_country_key` ON `Country`;

-- CreateIndex
CREATE UNIQUE INDEX `Country_id_country_name_key` ON `Country`(`id_country`, `name`);
