-- AlterTable
ALTER TABLE `user` MODIFY `ban` ENUM('ACCOUNT', 'LIKE', 'COMMENT', 'NONE', 'POST', 'POST_COMMENT') NOT NULL;
