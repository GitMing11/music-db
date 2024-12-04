/*
  Warnings:

  - The primary key for the `artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `artist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `_usersavedartists` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[artistId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_usersavedartists` DROP FOREIGN KEY `_UserSavedArtists_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usersavedartists` DROP FOREIGN KEY `_UserSavedArtists_B_fkey`;

-- AlterTable
ALTER TABLE `artist` DROP PRIMARY KEY,
    ADD COLUMN `artistId` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `imageUrl` VARCHAR(191) NULL,
    MODIFY `popularity` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `_usersavedartists`;

-- CreateIndex
CREATE UNIQUE INDEX `Artist_artistId_key` ON `Artist`(`artistId`);

-- AddForeignKey
ALTER TABLE `Artist` ADD CONSTRAINT `Artist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `_usergenres` RENAME INDEX `_usergenres_AB_unique` TO `_UserGenres_AB_unique`;

-- RenameIndex
ALTER TABLE `_usergenres` RENAME INDEX `_usergenres_B_index` TO `_UserGenres_B_index`;
