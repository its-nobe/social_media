```sql

-- trigger

use social_media;
delimiter $
CREATE TRIGGER welcome
AFTER INSERT
ON users
FOR EACH ROW
BEGIN
INSERT INTO posts(id, title, postText, username, createdAt, updatedAt, UserId)
VALUES (DEFAULT, "Welcome Post", "Welcome to Social Media", new.username, now(), now(), new.id);
END$
delimiter ;


-- function

CREATE FUNCTION `top_post` ()
RETURNS INTEGER
DETERMINISTIC
BEGIN
DECLARE top_postId INTEGER;
SELECT postId INTO top_postId FROM social_media.likes GROUP BY postId ORDER BY count(id) desc limit 1;
RETURN top_postId;
END


```
