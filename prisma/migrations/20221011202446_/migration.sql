/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `City_id_city_name_key` ON `City`;

-- CreateIndex
CREATE UNIQUE INDEX `City_name_key` ON `City`(`name`);
