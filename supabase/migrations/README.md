# Supabase Migrations

This directory contains SQL migration files for the Supabase database.

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed:

```bash
# Link to your project (first time only)
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of the migration file
4. Run the SQL

### Option 3: Using Supabase CLI (Local Development)

```bash
# Start local Supabase (requires Docker)
supabase start

# Apply migrations locally
supabase migration up
```

## Migration Files

- `001_create_auth_tokens.sql` - Creates the auth_tokens table for storing authentication tokens
