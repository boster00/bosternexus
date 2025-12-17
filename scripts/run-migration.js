/**
 * Script to run Supabase migrations
 * Uses Supabase service role to execute SQL migrations
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration(migrationFile) {
  try {
    console.log(`📄 Reading migration: ${migrationFile}`);
    const migrationPath = join(__dirname, '..', migrationFile);
    const sql = readFileSync(migrationPath, 'utf-8');

    // Split SQL into individual statements (semicolon-separated)
    // Remove comments and empty lines
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔧 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          
          // If RPC doesn't work, try direct query (some Supabase setups)
          if (error) {
            // Try using the REST API directly
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({ sql_query: statement }),
            });

            if (!response.ok) {
              // Last resort: execute via PostgREST query
              // Note: This requires a custom function or direct connection
              console.warn(`⚠️  Statement ${i + 1} may need manual execution`);
            }
          }
        } catch (err) {
          console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        }
      }
    }

    // Alternative: Execute the entire SQL as one query using a direct connection
    // We'll use Supabase's REST API with a custom endpoint or direct SQL execution
    console.log('🔄 Attempting direct SQL execution...');
    
    // Use Supabase's query method - this requires the SQL to be executed via a function
    // Since Supabase doesn't expose direct SQL execution via JS client, we'll need to
    // use the REST API or create a helper function
    
    // For now, let's try using the REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ query: sql }),
    });

    if (response.ok) {
      console.log('✅ Migration executed successfully!');
    } else {
      throw new Error(`Migration failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n💡 Alternative: Run the SQL directly in Supabase Dashboard:');
    console.error('   1. Go to your Supabase project');
    console.error('   2. Navigate to SQL Editor');
    console.error('   3. Copy and paste the contents of:', migrationFile);
    console.error('   4. Click "Run"');
    process.exit(1);
  }
}

// Run the migration
const migrationFile = process.argv[2] || 'supabase/migrations/001_create_auth_tokens.sql';
runMigration(migrationFile);
