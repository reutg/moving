ALTER TABLE `users` ADD `onboarding_completed_at` integer;--> statement-breakpoint
UPDATE `users`
SET `onboarding_completed_at` = `created_at`
WHERE `id` IN (SELECT DISTINCT `user_id` FROM `moves`);
