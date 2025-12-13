#!/bin/bash

# BosterNexus Architecture Enforcement Script
# Runs automated checks to verify architecture compliance

set -e

echo "=========================================="
echo "BosterNexus Architecture Audit"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ERRORS=$((ERRORS + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# Check 1: .cursorrules exists
echo "1. Checking .cursorrules file..."
if [ -f ".cursorrules" ]; then
    check_pass ".cursorrules exists"
    if grep -q "MUST NOT" .cursorrules && grep -q "ExternalApiClient" .cursorrules; then
        check_pass ".cursorrules contains required rules"
    else
        check_fail ".cursorrules missing key rules"
    fi
else
    check_fail ".cursorrules not found"
fi
echo ""

# Check 2: Monorepo structure
echo "2. Checking monorepo structure..."
if [ -d "apps/web" ] && [ -d "apps/api" ] && [ -d "packages/foundation" ] && [ -d "packages/shared" ]; then
    check_pass "Required directories exist"
else
    check_fail "Missing required directories"
fi

if grep -q "workspaces" package.json; then
    check_pass "Workspace configuration found"
else
    check_fail "Workspace configuration missing"
fi
echo ""

# Check 3: Docker Compose + Nginx
echo "3. Checking Docker Compose + Nginx..."
if [ -f "infra/compose/docker-compose.yml" ]; then
    check_pass "docker-compose.yml exists"
    if grep -q "web:" infra/compose/docker-compose.yml && grep -q "api:" infra/compose/docker-compose.yml && grep -q "nginx:" infra/compose/docker-compose.yml; then
        check_pass "All required services defined"
    else
        check_fail "Missing required services"
    fi
else
    check_fail "docker-compose.yml not found"
fi

if [ -f "infra/nginx/default.conf" ]; then
    check_pass "Nginx config exists"
    if grep -q "location /api" infra/nginx/default.conf && grep -q "location /" infra/nginx/default.conf; then
        check_pass "Nginx routing configured"
    else
        check_fail "Nginx routing missing"
    fi
else
    check_fail "Nginx config not found"
fi
echo ""

# Check 4: Next.js boundary enforcement
echo "4. Checking Next.js boundary enforcement..."
if command -v rg &> /dev/null; then
    FORBIDDEN_IMPORTS=$(rg -n "from [\"']\.\./.*apps/api|@/apps/api|apps/api" apps/web 2>/dev/null | wc -l)
    if [ "$FORBIDDEN_IMPORTS" -eq 0 ]; then
        check_pass "No forbidden imports from apps/api"
    else
        check_fail "Found $FORBIDDEN_IMPORTS forbidden import(s) from apps/api"
        rg -n "from [\"']\.\./.*apps/api|@/apps/api|apps/api" apps/web 2>/dev/null || true
    fi

    # Check for fetch/axios outside client-api (excluding node_modules)
    DIRECT_FETCH=$(rg -n "fetch\(|axios\(" apps/web/src apps/web/app --exclude="**/client-api/**" 2>/dev/null | wc -l)
    if [ "$DIRECT_FETCH" -eq 0 ]; then
        check_pass "No direct fetch/axios outside client-api"
    else
        check_warn "Found $DIRECT_FETCH direct fetch/axios call(s) outside client-api"
        rg -n "fetch\(|axios\(" apps/web/src apps/web/app --exclude="**/client-api/**" 2>/dev/null || true
    fi
else
    check_warn "ripgrep (rg) not installed - skipping pattern checks"
fi

if [ -f "apps/web/src/client-api/NexusApiClient.ts" ]; then
    check_pass "NexusApiClient exists"
else
    check_fail "NexusApiClient not found"
fi
echo ""

# Check 5: Backend layering
echo "5. Checking backend layering..."
if [ -f "apps/api/src/search/search.controller.ts" ]; then
    if grep -q "searchFacade" apps/api/src/search/search.controller.ts; then
        check_pass "Controller calls Facade"
    else
        check_fail "Controller does not call Facade"
    fi
else
    check_fail "SearchController not found"
fi

if [ -f "apps/api/src/search/search.facade.ts" ]; then
    if grep -q "orchestrator" apps/api/src/search/search.facade.ts; then
        check_pass "Facade calls Orchestrator"
    else
        check_fail "Facade does not call Orchestrator"
    fi
else
    check_fail "SearchFacade not found"
fi

if [ -f "apps/api/src/search/search.orchestrator.ts" ]; then
    if grep -q "pipeline" apps/api/src/search/search.orchestrator.ts; then
        check_pass "Orchestrator calls Pipeline"
    else
        check_fail "Orchestrator does not call Pipeline"
    fi
else
    check_fail "SearchOrchestrator not found"
fi
echo ""

# Check 6: Foundation primitives
echo "6. Checking foundation primitives..."
FOUNDATION_FILES=(
    "packages/foundation/src/errors/AppError.ts"
    "packages/foundation/src/result/Result.ts"
    "packages/foundation/src/logger/Logger.ts"
    "packages/foundation/src/external-api/ExternalApiClient.ts"
    "packages/foundation/src/idempotency/IdempotencyStore.ts"
)

for file in "${FOUNDATION_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$(basename $file) exists"
    else
        check_fail "$(basename $file) not found"
    fi
done

if command -v rg &> /dev/null; then
    FOUNDATION_USAGE=$(rg -n "@bosternexus/foundation" apps/api/src 2>/dev/null | wc -l)
    if [ "$FOUNDATION_USAGE" -gt 0 ]; then
        check_pass "Foundation package used in API ($FOUNDATION_USAGE imports)"
    else
        check_warn "Foundation package not used in API"
    fi
fi
echo ""

# Check 7: ALS Context
echo "7. Checking ALS Context implementation..."
if [ -f "apps/api/src/context/Context.ts" ]; then
    if grep -q "AsyncLocalStorage" apps/api/src/context/Context.ts; then
        check_pass "Context uses AsyncLocalStorage"
    else
        check_fail "Context does not use AsyncLocalStorage"
    fi
else
    check_fail "Context.ts not found"
fi

if [ -f "apps/api/src/context/context.middleware.ts" ]; then
    check_pass "ContextMiddleware exists"
else
    check_fail "ContextMiddleware not found"
fi

if grep -q "ContextMiddleware" apps/api/src/app.module.ts 2>/dev/null; then
    check_pass "ContextMiddleware registered in AppModule"
else
    check_fail "ContextMiddleware not registered"
fi

if command -v rg &> /dev/null; then
    GLOBALS=$(rg -n "let\s+current|global\.|process\.domain" apps/api/src 2>/dev/null | wc -l)
    if [ "$GLOBALS" -eq 0 ]; then
        check_pass "No module-level globals found"
    else
        check_warn "Found $GLOBALS potential global variable(s)"
    fi
fi
echo ""

# Check 8: Search flow
echo "8. Checking search flow..."
if [ -f "apps/api/src/search/search.controller.ts" ] && [ -f "apps/web/src/app/search/page.tsx" ]; then
    check_pass "Search endpoints exist (backend + frontend)"
    if grep -q "nexusApiClient" apps/web/src/app/search/page.tsx; then
        check_pass "Frontend uses NexusApiClient"
    else
        check_fail "Frontend does not use NexusApiClient"
    fi
else
    check_fail "Search flow incomplete"
fi
echo ""

# Check 9: Transaction watchdog
echo "9. Checking transaction watchdog..."
if [ -f "apps/api/src/transaction/transaction.watchdog.ts" ]; then
    if grep -q "@Cron" apps/api/src/transaction/transaction.watchdog.ts; then
        check_pass "TransactionWatchdog has cron job"
    else
        check_fail "TransactionWatchdog missing cron job"
    fi
    if grep -q "ALERT" apps/api/src/transaction/transaction.watchdog.ts; then
        check_pass "TransactionWatchdog logs ALERT"
    else
        check_fail "TransactionWatchdog does not log ALERT"
    fi
else
    check_fail "TransactionWatchdog not found"
fi

if [ -f "apps/api/src/transaction/transaction.controller.ts" ]; then
    if grep -q "POST\|@Post" apps/api/src/transaction/transaction.controller.ts; then
        check_pass "Transaction controller has POST endpoint"
    else
        check_fail "Transaction controller missing POST endpoint"
    fi
else
    check_fail "TransactionController not found"
fi
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}$WARNINGS warning(s)${NC}"
    exit 0
else
    echo -e "${RED}$ERRORS error(s), $WARNINGS warning(s)${NC}"
    exit 1
fi

