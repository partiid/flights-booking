/*
 Warnings:
 
 - Added the required column `distance` to the `Flight` table without a default value. This is not possible if the table is not empty.
 - Added the required column `duration` to the `Flight` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE `Flight`
ADD COLUMN `distance` DOUBLE NOT NULL,
  ADD COLUMN `duration` DOUBLE NOT NULL;