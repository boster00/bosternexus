/**
 * Script to create zoho_books_items table
 * Requires DATABASE_URL environment variable
 */

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  // Get database connection string
  let databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  // Try to construct from Supabase URL if we have the password
  if (!databaseUrl && process.env.SUPABASE_DB_PASSWORD) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      // Extract project ref from Supabase URL
      const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
      if (match) {
        const projectRef = match[1];
        databaseUrl = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;
      }
    }
  }
  
  if (!databaseUrl) {
    console.error('❌ Missing DATABASE_URL or SUPABASE_DB_URL environment variable');
    console.error('\n💡 To get your database URL:');
    console.error('   1. Go to Supabase Dashboard > Settings > Database');
    console.error('   2. Copy the "Connection string" > "URI"');
    console.error('   3. Add it to .env.local as DATABASE_URL');
    console.error('\n   Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres');
    console.error('\n   Or add SUPABASE_DB_PASSWORD to .env.local and the script will construct it');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('📄 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '004_create_zoho_books_items.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('🔧 Executing migration...\n');
    
    // Execute the SQL
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('   Created zoho_books_items table with:');
    console.log('   - All columns (zoho_id, name, status, rate, etc.)');
    console.log('   - Unique constraint on zoho_id');
    console.log('   - Indexes for performance');
    console.log('   - RLS policies for security');
    console.log('   - Automatic updated_at trigger');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === '42P07') {
      console.error('   (Table already exists - this is OK)');
    } else {
      console.error('\nFull error:', error);
      process.exit(1);
    }
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

runMigration();
