-- 1) add optional address and website columns to roasters
ALTER TABLE roasters
    ADD COLUMN address JSONB;
ALTER TABLE roasters 
    ADD COLUMN website text;

-- 2) no RLS needed on roasters yet
