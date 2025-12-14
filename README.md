# Boster Nexus

**Internal system platform for Boster Bio (bosterbio.com)**

A security-first monorepo containing:
- Next.js storefront web app (public Boster Bio site) - **Presentation layer only**
- NestJS backend (BFF + business logic + integrations) - **Single source of truth**
- Shared packages for types and foundations

**Note:** "Boster Nexus" is the internal system name. All customer-facing UI uses "Boster" or "Boster Bio" branding.

## Security-First Architecture

This project enforces strict boundaries between frontend and backend:

- **Next.js** is presentation-only: renders data, calls APIs, no business logic
- **NestJS** is the trust boundary: all business logic, validation, and integrations
- **Strict Validation**: All endpoints use Zod schemas with "deny unknown keys"
- **Idempotency**: All state-mutating operations require idempotency keys
- **Context Isolation**: Request context only in allowed layers

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (optional)

### Installation

```bash
# Install dependencies
npm install

# Build shared packages
npm run build --workspace=packages/shared
npm run build --workspace=packages/foundation
```

### Development

**Option 1: Individual services**
```bash
# Terminal 1: API (port 4000)
npm run api:dev

# Terminal 2: Web (port 3001)
npm run web:dev
```

**Option 2: Docker Compose (port 8080)**
```bash
npm run dev
```

### Verification

See [VERIFICATION.md](./VERIFICATION.md) for detailed verification commands.

Quick checks:
```bash
# Health endpoint
curl http://localhost:8080/api/health

# Search endpoint
curl "http://localhost:8080/api/search?q=bdnf"

# Frontend
open http://localhost:8080
```

## Architecture

### Boundary Model

```
┌─────────────────┐
│   Next.js Web   │  Presentation only
│  (apps/web)     │  → Calls NexusApiClient
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  NestJS API     │  Trust boundary
│  (apps/api)     │  → Strict validation
│                 │  → Business logic
│                 │  → Integrations
└─────────────────┘
```

### Key Principles

1. **Strict Input Validation**: Every endpoint validates with Zod schemas (deny unknown keys)
2. **Idempotency**: State-mutating operations require idempotency keys
3. **Context Isolation**: AsyncLocalStorage context only in controllers/facades/orchestrators
4. **No Server Actions**: Next.js uses explicit REST endpoints, not server functions
5. **Single API Client**: All frontend API calls go through `NexusApiClient`

## Project Structure

```
bosternexus/
├── apps/
│   ├── web/          # Next.js frontend (presentation)
│   └── api/          # NestJS backend (business logic)
├── packages/
│   ├── foundation/   # AppError, Result, Logger, ExternalApiClient
│   └── shared/       # DTOs and Zod schemas
├── infra/
│   ├── compose/      # Docker Compose
│   └── nginx/        # Nginx config with security limits
└── .cursorrules      # Architecture enforcement rules
```

## Security Features

- ✅ Strict Zod validation (deny unknown keys)
- ✅ Idempotency keys for state mutations
- ✅ Request context with requestId/sessionId
- ✅ Log redaction for secrets/PII
- ✅ Nginx rate limiting
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Request size limits

## Development Guidelines

See `.cursorrules` for complete architecture rules. Key points:

- **Frontend**: Only calls `NexusApiClient`, no direct fetch/axios
- **Backend**: Controllers → Facades → Orchestrators → Pipelines
- **Validation**: All endpoints use Zod schemas from `@bosternexus/shared`
- **Context**: Only in controllers/facades/orchestrators/integrations

## Dependency Management

See [DEPENDENCY_AUDIT.md](./DEPENDENCY_AUDIT.md) for dependency auditing procedures.

Quick audit:
```bash
npm audit
npm audit --workspace=apps/web
npm audit --workspace=apps/api
```

## Deployment

Target: Single VPS + Docker Compose + Nginx, fronted by Cloudflare

```bash
# Build
npm run build

# Start
npm run start
```

## Status

✅ Security-first architecture  
✅ Strict validation with Zod  
✅ Health endpoint  
✅ Search example with full cascade  
✅ Transaction watchdog skeleton  
✅ Docker Compose + Nginx  
✅ Dependency audit documentation  

Not yet implemented:
- Full PIM/CMS/admin UI
- Payment capture flow
- Production database integration
- Full integration clients (Zoho, FedEx)

## License

Private - Boster Bio Internal Use Only
