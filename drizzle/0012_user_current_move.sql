ALTER TABLE `users` ADD `current_move_id` integer;--> statement-breakpoint
UPDATE `users`
SET `current_move_id` = (
  SELECT `id`
  FROM `moves`
  WHERE `moves`.`user_id` = `users`.`id`
    AND `moves`.`status` = 'active'
  ORDER BY `moves`.`created_at` DESC
  LIMIT 1
)
WHERE `current_move_id` IS NULL;--> statement-breakpoint
UPDATE `users`
SET `current_move_id` = (
  SELECT `id`
  FROM `moves`
  WHERE `moves`.`user_id` = `users`.`id`
  ORDER BY `moves`.`created_at` DESC
  LIMIT 1
)
WHERE `current_move_id` IS NULL
  AND EXISTS (SELECT 1 FROM `moves` WHERE `moves`.`user_id` = `users`.`id`);
