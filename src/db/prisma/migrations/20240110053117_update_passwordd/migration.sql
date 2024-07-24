CREATE OR REPLACE FUNCTION notify_password_update() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
    PERFORM pg_notify('password_updates', 'Password updated for user ' || NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER password_update_trigger
AFTER INSERT OR UPDATE OF password ON users
FOR EACH ROW
EXECUTE FUNCTION notify_password_update();
