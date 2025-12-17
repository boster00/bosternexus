import { NextResponse } from "next/server";
import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * API route to add sub_total columns to Zoho Books transaction tables
 * Call this endpoint: POST /api/migrations/add-sub-total-columns
 * 
 * This will execute the SQL migration to add sub_total columns to:
 * - zoho_books_invoices
 * - zoho_books_salesorders
 * - zoho_books_purchaseorders
 * - zoho_books_bills
 * 
 * This migration is idempotent and safe to run multiple times.
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
        details: error.toString()
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
    const migrationPath = join(process.cwd(), "supabase", "migrations", "007_add_sub_total_to_transactions.sql");
    const sql = readFileSync(migrationPath, "utf-8");

    // Execute the SQL
    await client.query(sql);
    
    await client.end();

    return NextResponse.json({
      success: true,
      message: "sub_total columns added successfully!",
      details: [
        "✅ Added sub_total column to zoho_books_invoices",
        "✅ Added sub_total column to zoho_books_salesorders",
        "✅ Added sub_total column to zoho_books_purchaseorders",
        "✅ Added sub_total column to zoho_books_bills",
        "✅ Added check constraints for all columns",
        "✅ Added column comments"
      ],
      note: "The Supabase schema cache should refresh automatically. If you still see errors, wait a few seconds and try again."
    });

  } catch (error) {
    await client.end();
    
    // Check if columns already exist (this is OK for idempotent migrations)
    if (error.message?.includes('already exists') || error.code === '42701') {
      return NextResponse.json({
        success: true,
        message: "sub_total columns already exist",
        warning: "Columns were not modified (this is expected for idempotent migrations)"
      });
    }
    
    throw error;
  }
}
