-- Rename existing 'unpacked' rows to the new 'packing' status before
-- the table is recreated with `status` defaulting to 'packing'.
UPDATE `boxes` SET `status` = 'packing' WHERE `status` = 'unpacked';--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_boxes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`source_room` text,
	`destination_room` text NOT NULL,
	`status` text DEFAULT 'packing' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_boxes`("id", "name", "description", "source_room", "destination_room", "status", "priority", "created_at", "updated_at") SELECT "id", "name", "description", "source_room", "destination_room", "status", "priority", "created_at", "updated_at" FROM `boxes`;--> statement-breakpoint
DROP TABLE `boxes`;--> statement-breakpoint
ALTER TABLE `__new_boxes` RENAME TO `boxes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;