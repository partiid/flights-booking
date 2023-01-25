/*
 Warnings:
 
 - Added the required column `capacity` to the `Aircraft` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE `Aircraft`
ADD COLUMN `capacity` INTEGER NOT NULL;