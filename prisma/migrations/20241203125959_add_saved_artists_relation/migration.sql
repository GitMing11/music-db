/*
  Warnings:

  - You are about to drop the column `artist_id` on the `artist` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `artist` table. All the data in the column will be lost.
  - Added the required column `popularity` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Artist_artist_id_key` ON `artist`;

-- AlterTable
ALTER TABLE `artist` DROP COLUMN `artist_id`,
    DROP COLUMN `image_url`,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `popularity` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_UserSavedArtists` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserSavedArtists_AB_unique`(`A`, `B`),
    INDEX `_UserSavedArtists_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserSavedArtists` ADD CONSTRAINT `_UserSavedArtists_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserSavedArtists` ADD CONSTRAINT `_UserSavedArtists_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
