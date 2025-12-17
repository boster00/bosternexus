-- Set database timezone to UTC
-- This ensures all timestamp operations use UTC regardless of server location
-- The server is in Singapore (UTC+8), but we want all timestamps in UTC for consistency

-- Set timezone for the current session (applies to all connections)
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Also set it at the role level (for the postgres user)
ALTER ROLE postgres SET timezone TO 'UTC';

-- Verify current timezone setting
-- This will show 'UTC' if successful
SELECT current_setting('timezone') AS current_timezone;

-- Note: For Supabase, you may need to set this in the Supabase dashboard:
-- Settings > Database > Connection Pooling > Timezone
-- Or contact Supabase support to set it at the project level
