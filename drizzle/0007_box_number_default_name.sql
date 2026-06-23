-- Default box names use the per-move label number, not the internal id.
DROP TRIGGER IF EXISTS `boxes_set_default_name`;
--> statement-breakpoint
CREATE TRIGGER `boxes_set_default_name`
AFTER INSERT ON `boxes`
WHEN NEW.name = ''
BEGIN
  UPDATE `boxes` SET `name` = 'Box #' || NEW.number WHERE `id` = NEW.id;
END;
