-- When a box is inserted without a name (empty string), fill it with
-- "Box #<id>" using the autoincrement id. Renames after insert are preserved
-- because the trigger only fires on INSERT.
CREATE TRIGGER `boxes_set_default_name`
AFTER INSERT ON `boxes`
WHEN NEW.name = ''
BEGIN
  UPDATE `boxes` SET `name` = 'Box #' || NEW.id WHERE `id` = NEW.id;
END;
