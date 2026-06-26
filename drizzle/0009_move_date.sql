ALTER TABLE `moves` ADD `move_date` integer;--> statement-breakpoint
UPDATE `moves` SET `move_date` = `start_date` WHERE `start_date` IS NOT NULL;--> statement-breakpoint
ALTER TABLE `moves` DROP COLUMN `start_date`;--> statement-breakpoint
ALTER TABLE `moves` DROP COLUMN `end_date`;
