ALTER TABLE `boxes` ADD `room_id` integer REFERENCES rooms(id) ON UPDATE no action ON DELETE restrict;--> statement-breakpoint
-- Backfill room_id by matching the box's destination_room key to a room of that
-- type within the same move.
UPDATE `boxes`
SET `room_id` = (
	SELECT `rooms`.`id`
	FROM `rooms`
	WHERE `rooms`.`move_id` = `boxes`.`move_id`
	  AND `rooms`.`type` = `boxes`.`destination_room`
	LIMIT 1
)
WHERE `room_id` IS NULL;
