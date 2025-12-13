# BosterNexus

A monorepo containing:
- Next.js storefront web app (public site)
- NestJS backend (BFF + business logic + integrations)
- Shared packages for types and foundations

## Architecture

This project follows a clean, layered architecture:

- **Frontend (Next.js)**: Pages call only `NexusApiClient` methods - no business logic
- **Backend (NestJS)**: Layered architecture with Controllers → Facades → Orchestrators → Pipelines
- **Foundation Package**: Core primitives (AppError, Result, Logger, ExternalApiClient, Idempotency)
- **Shared Package**: DTOs and types shared between frontend and backend

## Project Structure

```
bosternexus/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/           # Next.js frontend
├── packages/
│   ├── foundation/   # Core primitives
│   └── shared/       # Shared DTOs/types
└── infra/
    ├── compose/       # Docker Compose config
    └── nginx/         # Nginx reverse proxy config
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start all services with Docker Compose:
```bash
npm run dev
```

Or start services individually:
```bash
# Terminal 1: API
npm run api:dev

# Terminal 2: Web
npm run web:dev
```

### Docker Deployment

Build and start all services:
```bash
npm run build
npm run start
```

Stop services:
```bash
npm run dev:down
```

## Services

- **Web**: http://localhost:3000 (direct) or http://localhost:8080 (via Nginx)
- **API**: http://localhost:4000 (direct) or http://localhost:8080/api (via Nginx)
- **Nginx**: http://localhost:8080 (reverse proxy)

## Verification

1. Test API search endpoint:
```bash
curl http://localhost:8080/api/search?q=bdnf
```

2. Open homepage:
```
http://localhost:8080
```

3. Test search page:
```
http://localhost:8080/search?q=bdnf
```

## Architecture Audit

Run automated architecture compliance checks:

**Linux/macOS:**
```bash
./scripts/audit.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\audit.ps1
```

The audit script verifies:
- `.cursorrules` exists and contains required rules
- Monorepo structure matches specification
- Docker Compose + Nginx configuration
- Next.js boundary enforcement (no backend imports)
- Backend layering compliance
- Foundation primitives exist and are used
- ALS Context implementation
- Search flow end-to-end
- Transaction watchdog skeleton

See `AUDIT_REPORT.md` for detailed validation results.

## Architecture Rules

See `.cursorrules` for detailed architecture rules. Key principles:

- Next.js pages MUST NOT implement business logic
- Next.js MUST NOT import from `apps/api/**`
- All external API calls MUST go through `ExternalApiClient`
- Backend follows strict layering: Controller → Facade → Orchestrator → Pipeline
- Use AsyncLocalStorage Context for request correlation
- All operations that mutate external state require idempotency keys

## Phase 1 Scope

✅ Monorepo scaffold
✅ Foundation primitives
✅ Search flow example
✅ Transaction watchdog skeleton
✅ Integration client skeletons
✅ Docker Compose + Nginx
✅ BosterBio-style homepage

Not yet implemented:
- Full PIM/CMS/admin UI
- Full SEO
- Payment capture flow
- Production database

