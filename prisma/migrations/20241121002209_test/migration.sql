/*
  Warnings:

  - The primary key for the `track` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_trackId_fkey`;

-- AlterTable
ALTER TABLE `like` MODIFY `trackId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `track` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `Track`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
