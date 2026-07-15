CREATE TABLE `checklist_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`move_id` integer NOT NULL,
	`title` text NOT NULL,
	`section` text DEFAULT 'beforeMoving' NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`move_id`) REFERENCES `moves`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `checklist_tasks_move_id_idx` ON `checklist_tasks` (`move_id`);
--> statement-breakpoint
CREATE INDEX `checklist_tasks_move_section_idx` ON `checklist_tasks` (`move_id`,`section`);
