/**
 * Script to run Supabase migrations using direct PostgreSQL connection
 * Usage: node scripts/run-migrations.js [migration-file]
 * Example: node scripts/run-migrations.js 005_create_zoho_books_transactions.sql
 * Or run all: node scripts/run-migrations.js
 */

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration(client, migrationFile) {
  try {
    console.log(`\n📄 Reading migration: ${migrationFile}`);
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', migrationFile);
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log(`🔧 Executing migration: ${migrationFile}...`);
    
    // Execute the SQL
    await client.query(sql);
    
    console.log(`✅ Migration ${migrationFile} completed successfully!`);
    return true;
  } catch (error) {
    if (error.code === '42P07') {
      console.log(`⚠️  Table already exists in ${migrationFile} (this is OK)`);
      return true;
    } else if (error.code === '42710') {
      console.log(`⚠️  Object already exists in ${migrationFile} (this is OK)`);
      return true;
    } else {
      console.error(`❌ Migration ${migrationFile} failed:`, error.message);
      throw error;
    }
  }
}

async function runAllMigrations() {
  // Get database connection string
  let databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  // Try to construct from Supabase URL if we have the password
  if (!databaseUrl && process.env.SUPABASE_DB_PASSWORD) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
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
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Get migration file from command line or run all
    const migrationFile = process.argv[2];
    
    if (migrationFile) {
      // Run specific migration
      await runMigration(client, migrationFile);
    } else {
      // Run all migrations in order
      console.log('📋 Running all migrations in order...\n');
      const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
      const files = readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort(); // Sort alphabetically to run in order
      
      for (const file of files) {
        await runMigration(client, file);
      }
      
      console.log('\n✅ All migrations completed!');
    }
    
  } catch (error) {
    console.error('\n❌ Migration process failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

runAllMigrations();
