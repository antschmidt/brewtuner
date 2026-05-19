-- filepath: migrations/165_alter_address_to_jsonb.up.sql
-- Convert address column to JSONB with structured fields
-- 1) drop old text column
ALTER TABLE roasters
  DROP COLUMN address;

-- 2) add new JSONB address column
ALTER TABLE roasters
  ADD COLUMN address JSONB;

-- 3) you can later populate address with objects like:
-- UPDATE roasters SET address = '{"street":"123 Main St","city":"Townsville","state":"TS","zip":"12345","phone":"555-1234"}'::jsonb WHERE id = '<roaster-id>';
