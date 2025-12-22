-- Add settings JSONB column to profiles table
-- This column stores user-specific settings including dashboard bookmarks

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Add comment to document the settings structure
COMMENT ON COLUMN profiles.settings IS 'User-specific settings stored as JSONB. Structure: { "dashboard_bookmarks": ["module_id1", "module_id2", ...] }';

-- Create index for efficient querying of settings
CREATE INDEX IF NOT EXISTS idx_profiles_settings ON profiles USING GIN (settings);
