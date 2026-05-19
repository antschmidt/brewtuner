-- 1) add the column (allow NULL temporarily)
ALTER TABLE grind_logs
  ADD COLUMN user_id uuid;

-- 1b) backfill: assign existing logs to the first user (replace with a valid auth.users.id)
UPDATE grind_logs
  SET user_id = (
    SELECT id FROM auth.users ORDER BY created_at LIMIT 1
  )
  WHERE user_id IS NULL;

-- 1c) enforce not-null after backfill
ALTER TABLE grind_logs
  ALTER COLUMN user_id SET NOT NULL;

-- 2) foreign-key constraint against auth.users
ALTER TABLE grind_logs
  ADD CONSTRAINT grind_logs_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- 3) enable row-level security
ALTER TABLE grind_logs ENABLE ROW LEVEL SECURITY;

-- 4) policy: only owner can SELECT
CREATE POLICY select_own_logs ON grind_logs
  FOR SELECT USING (user_id = current_setting('hasura.user', true)::uuid);

-- 5) policy: user_id must match session on INSERT
CREATE POLICY insert_own_logs ON grind_logs
  FOR INSERT WITH CHECK (user_id = current_setting('hasura.user', true)::uuid);

-- 6) policy: only owner can UPDATE
CREATE POLICY update_own_logs ON grind_logs
  FOR UPDATE USING (user_id = current_setting('hasura.user', true)::uuid)
             WITH CHECK (user_id = current_setting('hasura.user', true)::uuid);

-- 7) policy: only owner can DELETE
CREATE POLICY delete_own_logs ON grind_logs
  FOR DELETE USING (user_id = current_setting('hasura.user', true)::uuid);

