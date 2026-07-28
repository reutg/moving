-- Ensure every box has a room_id before we drop the type-key column.
UPDATE `boxes`
SET `room_id` = (
	SELECT `rooms`.`id`
	FROM `rooms`
	WHERE `rooms`.`move_id` = `boxes`.`move_id`
	  AND `rooms`.`type` = `boxes`.`destination_room`
	LIMIT 1
)
WHERE `room_id` IS NULL;
--> statement-breakpoint
PRAGMA defer_foreign_keys = on;--> statement-breakpoint
CREATE TABLE `__new_boxes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`move_id` integer NOT NULL,
	`number` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`source_room` text,
	`room_id` integer NOT NULL,
	`status` text DEFAULT 'packing' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`move_id`) REFERENCES `moves`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_boxes`("id", "move_id", "number", "name", "description", "source_room", "room_id", "status", "priority", "created_at", "updated_at")
SELECT "id", "move_id", "number", "name", "description", "source_room", "room_id", "status", "priority", "created_at", "updated_at" FROM `boxes`;
--> statement-breakpoint
DROP TABLE `boxes`;--> statement-breakpoint
ALTER TABLE `__new_boxes` RENAME TO `boxes`;--> statement-breakpoint
CREATE UNIQUE INDEX `boxes_move_id_number_unique` ON `boxes` (`move_id`,`number`);--> statement-breakpoint
PRAGMA defer_foreign_keys = off;
