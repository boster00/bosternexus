/**
 * Script to create auth_tokens table in Supabase
 * Executes SQL migration directly via Supabase REST API
 */

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
  console.error('\n💡 Make sure these are set in your .env.local file');
  process.exit(1);
}

async function createTable() {
  try {
    console.log('📄 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '001_create_auth_tokens.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('🔧 Executing SQL migration...');
    console.log('   This will create the auth_tokens table with all indexes and RLS policies...\n');

    // Supabase doesn't expose direct SQL execution via REST API for security
    // We need to execute this via the Supabase Dashboard SQL Editor or use pgAdmin
    // However, we can create a helper function first, or use the Management API
    
    // Alternative: Use Supabase's REST API to execute via a stored procedure
    // But first, we need to create a function that can execute SQL
    
    // For now, let's try using the PostgREST endpoint with a custom function
    // Actually, the best way is to use Supabase's SQL execution via their API
    
    // Since direct SQL execution isn't available via the standard API,
    // we'll need to use the Supabase Dashboard or create a migration function
    
    // Let me try a different approach: use the Supabase client's ability to call RPC functions
    // But we need a function that executes SQL first
    
    // The most reliable way is to output instructions and also try to execute
    // via a direct PostgreSQL connection if possible
    
    console.log('⚠️  Supabase REST API does not support direct SQL execution for security reasons.');
    console.log('\n📋 Please run this SQL in your Supabase Dashboard:\n');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('\n📍 Steps:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Navigate to SQL Editor');
    console.log('   4. Paste the SQL above');
    console.log('   5. Click "Run"');
    console.log('\n✅ Or use Supabase CLI (if installed):');
    console.log('   supabase db push');
    
    // Try to use a workaround: create a temporary function and execute
    // But this requires the function to already exist in the database
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTable();
