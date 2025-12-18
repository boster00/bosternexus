-- Disable Row Level Security (RLS) for all Zoho-related tables
-- This migration removes RLS policies and disables RLS on Zoho tables
-- to allow service role access without user_id restrictions

-- Zoho Books Tables
ALTER TABLE IF EXISTS zoho_books_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_salesorders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_salesorder_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_purchaseorders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_purchaseorder_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_bill_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_invoice_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_creditnotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_estimates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_books_line_items DISABLE ROW LEVEL SECURITY;

-- Zoho CRM Tables
ALTER TABLE IF EXISTS zoho_crm_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_sales_inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_email_sequences DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_shipments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_crm_service_projects DISABLE ROW LEVEL SECURITY;

-- Zoho Desk Tables
ALTER TABLE IF EXISTS zoho_desk_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_desk_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_desk_agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS zoho_desk_departments DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies on these tables (optional cleanup)
-- Note: This will drop all policies, including any custom ones
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
        AND (
            tablename LIKE 'zoho_books_%' OR
            tablename LIKE 'zoho_crm_%' OR
            tablename LIKE 'zoho_desk_%'
        )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;
