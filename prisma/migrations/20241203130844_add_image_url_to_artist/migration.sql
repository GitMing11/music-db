/*
  Warnings:

  - The primary key for the `artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `imageUrl` on table `artist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_usersavedartists` DROP FOREIGN KEY `_UserSavedArtists_A_fkey`;

-- AlterTable
ALTER TABLE `_usersavedartists` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `artist` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `imageUrl` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `_UserSavedArtists` ADD CONSTRAINT `_UserSavedArtists_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
