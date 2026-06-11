-- Backfill destination_room before the column becomes NOT NULL.
-- Translate known display labels to their COMMON_LOCATIONS key.
UPDATE `boxes` SET `destination_room` = 'livingRoom'  WHERE `destination_room` = 'Living Room';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'kitchen'     WHERE `destination_room` = 'Kitchen';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'bedroom'     WHERE `destination_room` = 'Bedroom';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'bathroom'    WHERE `destination_room` = 'Bathroom';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'office'      WHERE `destination_room` = 'Office';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'kidsRoom'    WHERE `destination_room` = 'Kids'' Room';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'laundryRoom' WHERE `destination_room` = 'Laundry Room';--> statement-breakpoint
UPDATE `boxes` SET `destination_room` = 'garage'      WHERE `destination_room` = 'Garage';--> statement-breakpoint
-- Default anything still null or unrecognised so the NOT NULL constraint can apply.
UPDATE `boxes` SET `destination_room` = 'livingRoom'
WHERE `destination_room` IS NULL
   OR `destination_room` NOT IN (
        'livingRoom', 'kitchen', 'bedroom', 'bathroom',
        'office', 'kidsRoom', 'laundryRoom', 'garage'
      );--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_boxes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`source_room` text,
	`destination_room` text NOT NULL,
	`status` text DEFAULT 'unpacked' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_boxes`("id", "name", "description", "source_room", "destination_room", "status", "priority", "created_at", "updated_at") SELECT "id", "name", "description", "source_room", "destination_room", "status", "priority", "created_at", "updated_at" FROM `boxes`;--> statement-breakpoint
DROP TABLE `boxes`;--> statement-breakpoint
ALTER TABLE `__new_boxes` RENAME TO `boxes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;