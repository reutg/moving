PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_household_invites` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` integer NOT NULL,
	`email` text,
	`token` text NOT NULL,
	`invited_by_user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`expires_at` integer NOT NULL,
	`accepted_by_user_id` text,
	`accepted_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`invited_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`accepted_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);--> statement-breakpoint
INSERT INTO `__new_household_invites`("id", "household_id", "email", "token", "invited_by_user_id", "status", "expires_at", "accepted_by_user_id", "accepted_at", "created_at") SELECT "id", "household_id", "email", "token", "invited_by_user_id", "status", "expires_at", "accepted_by_user_id", "accepted_at", "created_at" FROM `household_invites`;--> statement-breakpoint
DROP TABLE `household_invites`;--> statement-breakpoint
ALTER TABLE `__new_household_invites` RENAME TO `household_invites`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `household_invites_token_unique` ON `household_invites` (`token`);--> statement-breakpoint
CREATE INDEX `household_invites_household_id_idx` ON `household_invites` (`household_id`);
