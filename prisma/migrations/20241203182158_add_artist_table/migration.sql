-- RenameIndex
ALTER TABLE `_usergenres` RENAME INDEX `_UserGenres_AB_unique` TO `_usergenres_AB_unique`;

-- RenameIndex
ALTER TABLE `_usergenres` RENAME INDEX `_UserGenres_B_index` TO `_usergenres_B_index`;

-- RenameIndex
ALTER TABLE `_usersavedartists` RENAME INDEX `_UserSavedArtists_AB_unique` TO `_usersavedartists_AB_unique`;

-- RenameIndex
ALTER TABLE `_usersavedartists` RENAME INDEX `_UserSavedArtists_B_index` TO `_usersavedartists_B_index`;
