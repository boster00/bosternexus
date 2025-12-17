import { NextResponse } from "next/server";
import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * API route to create auth_tokens table
 * Call this endpoint: POST /api/migrations/create-auth-tokens
 * 
 * This will execute the SQL migration to create the auth_tokens table
 */
export async function POST(req) {
  try {
    // Get database connection from environment
    // Try multiple possible env var names
    const databaseUrl = 
      process.env.DATABASE_URL || 
      process.env.SUPABASE_DB_URL ||
      process.env.POSTGRES_URL;

    if (!databaseUrl) {
      // Try to construct from Supabase URL and password
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const dbPassword = process.env.SUPABASE_DB_PASSWORD;
      
      if (supabaseUrl && dbPassword) {
        // Extract project ref from Supabase URL
        const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
        if (match) {
          const projectRef = match[1];
          // Use connection pooler
          const constructedUrl = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
          
          return await executeMigration(constructedUrl);
        }
      }
      
      return NextResponse.json(
        { 
          error: "Missing database connection string",
          instructions: [
            "Add one of these to your .env.local:",
            "- DATABASE_URL (full PostgreSQL connection string)",
            "- SUPABASE_DB_URL (full PostgreSQL connection string)",
            "- SUPABASE_DB_PASSWORD (password only, will construct URL)"
          ],
          help: "Get your connection string from: Supabase Dashboard > Settings > Database > Connection string > URI"
        },
        { status: 400 }
      );
    }

    return await executeMigration(databaseUrl);

  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { 
        error: error.message,
        details: error.code === '42P07' ? 'Table already exists (this is OK)' : error.toString()
      },
      { status: 500 }
    );
  }
}

async function executeMigration(databaseUrl) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
  });

  try {
    await client.connect();
    
    // Read the migration file
    const migrationPath = join(process.cwd(), "supabase", "migrations", "001_create_auth_tokens.sql");
    const sql = readFileSync(migrationPath, "utf-8");

    // Execute the SQL
    await client.query(sql);
    
    await client.end();

    return NextResponse.json({
      success: true,
      message: "auth_tokens table created successfully!",
      details: [
        "✅ Table created with all columns",
        "✅ Indexes created for performance",
        "✅ RLS policies enabled",
        "✅ Automatic updated_at trigger configured"
      ]
    });

  } catch (error) {
    await client.end();
    
    if (error.code === '42P07') {
      // Table already exists
      return NextResponse.json({
        success: true,
        message: "auth_tokens table already exists",
        warning: "Table was not modified"
      });
    }
    
    throw error;
  }
}
