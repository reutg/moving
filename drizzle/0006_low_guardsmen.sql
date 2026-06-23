CREATE TABLE `moves` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `moves` (`user_id`, `name`, `created_at`, `updated_at`)
SELECT `id`, 'My Move', unixepoch() * 1000, unixepoch() * 1000
FROM `users`
ORDER BY `created_at`
LIMIT 1;
--> statement-breakpoint
ALTER TABLE `boxes` ADD `move_id` integer NOT NULL DEFAULT 1 REFERENCES moves(id);
--> statement-breakpoint
ALTER TABLE `boxes` ADD `number` integer NOT NULL DEFAULT 1;
--> statement-breakpoint
UPDATE `boxes` SET `number` = `id`;
--> statement-breakpoint
CREATE UNIQUE INDEX `boxes_move_id_number_unique` ON `boxes` (`move_id`, `number`);
