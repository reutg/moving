CREATE TABLE `boxes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`source_room` text,
	`destination_room` text,
	`status` text DEFAULT 'unpacked' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`box_id` integer NOT NULL,
	`name` text NOT NULL,
	`fragile` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `items_box_id_idx` ON `items` (`box_id`);--> statement-breakpoint
CREATE TABLE `box_tags` (
	`box_id` integer NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`box_id`, `tag`),
	FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `box_tags_tag_idx` ON `box_tags` (`tag`);