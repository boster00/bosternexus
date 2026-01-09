-- Migration: Import Google Drive Files to BIC
-- Generated: 2025-01-XX
--
-- This migration imports selected files from Google Drive migration folder
-- Only includes instructional and useful resources for the team
-- Paperwork Doc items are marked as whitelist_only = true
--
-- IMPORTANT: After running this migration, update created_by
-- with the actual user ID who should own these articles
-- Also update html_content with actual document content where needed
--

-- ============================================================================
-- CORE DOCUMENTATION
-- ============================================================================

-- Boster Info Center Main Doc
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order", 
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Boster Info Center Main Document',
  'overview/boster-info-center-main-doc',
  '<h2>Boster Info Center Main Document</h2>
<p>Main documentation for Boster Info Center. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Boster Info Center--Main Doc.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Overview',
  '["documentation","core"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ============================================================================
-- PRODUCT MANAGEMENT
-- ============================================================================

-- Product Review Guidelines
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Product Review Guidelines',
  'product-management/product-review-guidelines',
  '<h2>Product Review Guidelines</h2>
<p>Guidelines for reviewing products. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Product Management/Product Review Guidelines.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Product Management',
  '["product","guidelines","review"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- SOP for Bad Stock
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'SOP for Bad Stock',
  'product-management/sop-bad-stock',
  '<h2>Standard Operating Procedure: Bad Stock</h2>
<p>Standard operating procedure for handling bad stock. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Product Management/SOP for bad stock.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Product Management',
  '["sop","stock","inventory"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  2,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ============================================================================
-- SUPPORT TEMPLATES
-- ============================================================================

-- Antibody Testing Program Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Antibody Testing Program Email Template',
  'support/templates/antibody-testing-program',
  '<h2>Antibody Testing Program Email Template</h2>
<p>Email template for antibody testing program inquiries. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Support/Support email templates/Antibody Testing Program.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Support',
  '["support","email","template","antibody"]'::jsonb,
  '["support@bosterbio.com"]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- DZ Antibody Emails Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'DZ Antibody Emails Template',
  'support/templates/dz-antibody-emails',
  '<h2>DZ Antibody Emails Template</h2>
<p>Email templates for DZ antibody inquiries. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Support/Support email templates/DZ antibody emails.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Support',
  '["support","email","template","dz","antibody"]'::jsonb,
  '["support@bosterbio.com"]'::jsonb,
  CURRENT_DATE,
  2,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Free Samples Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Free Samples Email Template',
  'support/templates/free-samples',
  '<h2>Free Samples Email Template</h2>
<p>Email template for free sample requests. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Support/Support email templates/Free samples.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Support',
  '["support","email","template","samples"]'::jsonb,
  '["support@bosterbio.com"]'::jsonb,
  CURRENT_DATE,
  3,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Paperwork Request Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Paperwork Request Email Template',
  'support/templates/paperwork-request',
  '<h2>Paperwork Request Email Template</h2>
<p>Email template for paperwork requests. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Support/Support email templates/Paperwork request.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Support',
  '["support","email","template","paperwork"]'::jsonb,
  '["support@bosterbio.com"]'::jsonb,
  CURRENT_DATE,
  4,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Product Performance Technical Support Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Product Performance Technical Support Template',
  'support/templates/product-performance-support',
  '<h2>Product Performance Technical Support Email Template</h2>
<p>Email template for product performance technical support inquiries. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Support/Support email templates/Product performance technical support.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Support',
  '["support","email","template","technical"]'::jsonb,
  '["support@bosterbio.com"]'::jsonb,
  CURRENT_DATE,
  5,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ============================================================================
-- MARKETING
-- ============================================================================

-- Neuro Conference Email Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Neuro Conference Email Template',
  'marketing/templates/neuro-conference-email',
  '<h2>Neuro Conference Email Template</h2>
<p>Email template for neuro conference marketing. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Email Template for Neuro Conference.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Marketing',
  '["marketing","email","template","conference"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ABC + AI: Animal Model Service Landing Page
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ABC Landing Page: Animal Model Service',
  'marketing/abc-ai/animal-model-landing',
  '<h2>ABC Landing Page Outline: Animal Model Service</h2>
<p>Landing page outline for Animal Model Service. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Marketing & BD/ABC + AI/Animal Model Service/ABC landing page outline_ Animal Model.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Marketing',
  '["marketing","abc","landing-page","animal-model"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  2,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ABC + AI: Animal Model Service Satellite Articles
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ABC Satellite Articles: Animal Model Service',
  'marketing/abc-ai/animal-model-satellite',
  '<h2>ABC Satellite Articles: Animal Model Service</h2>
<p>Satellite articles for Animal Model Service. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Marketing & BD/ABC + AI/Animal Model Service/ABC satellite articles_ Animal Model.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Marketing',
  '["marketing","abc","articles","animal-model"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  3,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ABC + AI: Antibody Discovery Satellite Articles
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ABC Satellite Articles: Antibody Discovery',
  'marketing/abc-ai/antibody-discovery-satellite',
  '<h2>ABC Satellite Articles: Antibody Discovery</h2>
<p>Satellite articles for Antibody Discovery. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Marketing & BD/ABC + AI/Antibody Discovery/ABC satellite articles_ Antibody Discovery.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Marketing',
  '["marketing","abc","articles","antibody-discovery"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  4,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ABC + AI: General Tox Keywords
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ABC Keywords by Funnel: General Tox',
  'marketing/abc-ai/general-tox-keywords',
  '<h2>ABC Keywords by Funnel: General Tox</h2>
<p>Keywords organized by funnel stage for General Tox. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Marketing & BD/ABC + AI/General Tox/ABC Keywords by Funnel, General Tox.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Marketing',
  '["marketing","abc","keywords","general-tox"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  5,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ABC + AI: General Tox Landing Page
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ABC Landing Page: General Tox',
  'marketing/abc-ai/general-tox-landing',
  '<h2>ABC Landing Page Outline: General Tox</h2>
<p>Landing page outline for General Tox. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Marketing & BD/ABC + AI/General Tox/ABC landing page outline_ General Tox.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Marketing',
  '["marketing","abc","landing-page","general-tox"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  6,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ============================================================================
-- LEGAL / CONTRACTS
-- ============================================================================

-- Distributor Authorization Letter Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Boster Distributor Authorization Letter 2024',
  'legal/contract-templates/distributor-authorization-letter-2024',
  '<h2>Boster Distributor Authorization Letter Template (2024)</h2>
<p>Template for distributor authorization letters. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Contracts Archive/Contract Templates/Boster Distributor Authorization Letter 2024.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Legal',
  '["legal","contract","template","distributor"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- OEM Partner Terms Agreement Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Boster OEM Partner Terms Agreement 2024',
  'legal/contract-templates/oem-partner-terms-2024',
  '<h2>Boster OEM Partner Terms Agreement Template (2024)</h2>
<p>Template for OEM partner terms agreements. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Contracts Archive/Contract Templates/Boster OEM Partner Terms Agreement 2024.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Legal',
  '["legal","contract","template","oem"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  2,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- PDP Premium Distributor Agreement Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'PDP Premium Distributor Agreement Template',
  'legal/contract-templates/pdp-premium-distributor-agreement',
  '<h2>PDP Premium Distributor Agreement Template</h2>
<p>Template for PDP premium distributor agreements. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Contracts Archive/Contract Templates/PDP Premium Distributor Agreement.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Legal',
  '["legal","contract","template","distributor","pdp"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  3,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- PDP Premium Distributor Agreement Kvalitex Template
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'PDP Premium Distributor Agreement Kvalitex Template',
  'legal/contract-templates/pdp-premium-distributor-kvalitex',
  '<h2>PDP Premium Distributor Agreement Kvalitex Template</h2>
<p>Template for PDP premium distributor agreement (Kvalitex variant). Content to be migrated from source document.</p>
<p><strong>Source:</strong> Contracts Archive/Contract Templates/PDP Premium Distributor Agreement Kvalitex.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'Legal',
  '["legal","contract","template","distributor","pdp","kvalitex"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  4,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- ============================================================================
-- PAPERWORK DOC (ALL WHITELIST ONLY)
-- ============================================================================

-- Boster W9 2025
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Boster W9 Form 2025',
  'paperwork/boster-w9-2025',
  '<h2>Boster W9 Form (2025)</h2>
<p>Boster W9 tax form dated 2025-11-04. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/Boster_W9_20251104.pdf</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive tax information. PDF content needs to be extracted and embedded.</p>',
  'Paperwork',
  '["paperwork","tax","w9","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- Bank Info Chase
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Boster Bio Bank Information - Chase Bank',
  'paperwork/bank-info-chase',
  '<h2>Boster Bio Bank Information - Chase Bank</h2>
<p>Bank information for Boster Bio at Chase Bank. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/BosterBioBankInfo_ChaseBank.pdf</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive banking information. PDF content needs to be extracted and embedded.</p>',
  'Paperwork',
  '["paperwork","bank","chase","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  2,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- CA Registration
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'California Registration',
  'paperwork/ca-registration',
  '<h2>California Registration</h2>
<p>California business registration document. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/CA Registration.pdf</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive business information. PDF content needs to be extracted and embedded.</p>',
  'Paperwork',
  '["paperwork","registration","california","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  3,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- ISO9001 Certificate 2025
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ISO9001 Certificate 2025',
  'paperwork/iso9001-certificate-2025',
  '<h2>ISO9001 Certificate (2025)</h2>
<p>ISO9001 quality management certificate dated 2025-08-25. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/ISO9001 certificate 2025.08.25.pdf</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive certification information. PDF content needs to be extracted and embedded.</p>',
  'Paperwork',
  '["paperwork","iso9001","certificate","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  4,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- Seller Permit
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Seller Permit - Boster Biological',
  'paperwork/seller-permit',
  '<h2>Seller Permit - Boster Biological</h2>
<p>Seller permit for Boster Biological. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/Seller Permit_BosterBiological.pdf</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive permit information. PDF content needs to be extracted and embedded.</p>',
  'Paperwork',
  '["paperwork","permit","seller","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  5,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- Information Security Policies
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Information Security Policies',
  'paperwork/info-security-policies',
  '<h2>Information Security Policies</h2>
<p>Information security policies document. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/Information Security Documents/Information Security Policies.docx</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive security information. Document needs to be converted from .docx and content extracted.</p>',
  'Paperwork',
  '["paperwork","security","policies","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  6,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- ISO 27001 Boster Bio
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'ISO 27001 Boster Bio',
  'paperwork/iso27001-boster-bio',
  '<h2>ISO 27001 Boster Bio</h2>
<p>ISO 27001 information security management documentation for Boster Bio. This is a sensitive document.</p>
<p><strong>Source:</strong> Paperwork Doc/Information Security Documents/ISO 27001 Boster Bio.docx</p>
<p><strong>Note:</strong> This document is whitelist-only due to sensitive security information. Document needs to be converted from .docx and content extracted.</p>',
  'Paperwork',
  '["paperwork","iso27001","security","sensitive"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  7,
  '[]'::jsonb,
  true, -- WHITELIST ONLY
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  is_whitelist_only = true,
  updated_at = NOW();

-- ============================================================================
-- IT / WEBSITE
-- ============================================================================

-- Web Dev Master Contents
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Web Dev Master Contents - Bosterbio.com',
  'it/web-dev-master-contents',
  '<h2>Web Dev Master Contents - Bosterbio.com</h2>
<p>Master contents spreadsheet for website development. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Website & IT systems/Web Dev Master Contents--Bosterbio.com.xlsx</p>
<p><strong>Note:</strong> This Excel file needs to be converted and content extracted.</p>',
  'IT',
  '["it","web-dev","contents","website"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  1,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Web Dev Master Roadmap
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Web Dev Master Roadmap - Bosterbio.com',
  'it/web-dev-master-roadmap',
  '<h2>Web Dev Master Roadmap - Bosterbio.com</h2>
<p>Master roadmap for website development. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Website & IT systems/Web Dev Master Roadmap--Bosterbio.com.docx</p>
<p><strong>Note:</strong> This document needs to be converted from .docx and content extracted.</p>',
  'IT',
  '["it","web-dev","roadmap","website"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  2,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Browser Shortcuts (check if exists first - may already be in DB)
INSERT INTO bic_articles (
  name, url, html_content, category, tags, owners, last_reviewed, "order",
  source_urls, is_whitelist_only, created_by, created_at, updated_at
) VALUES (
  'Browser Shortcuts',
  'it/browser-shortcuts',
  '<h2>Browser Shortcuts</h2>
<p>Browser shortcuts and bookmarklets for internal tools. Content to be migrated from source document.</p>
<p><strong>Source:</strong> Website & IT systems/Browser short cuts.docx</p>
<p><strong>Note:</strong> This may already exist in the database. If so, this will update it. Document needs to be converted from .docx and content extracted.</p>',
  'IT',
  '["it","browser","shortcuts","tools"]'::jsonb,
  '[]'::jsonb,
  CURRENT_DATE,
  3,
  '[]'::jsonb,
  false,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

