# BosterNexus Architecture Enforcement Script (PowerShell)
# Runs automated checks to verify architecture compliance

$ErrorActionPreference = "Continue"
$errors = 0
$warnings = 0

function Write-Pass {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
    $script:errors++
}

function Write-Warn {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
    $script:warnings++
}

Write-Host "=========================================="
Write-Host "BosterNexus Architecture Audit"
Write-Host "=========================================="
Write-Host ""

# Check 1: .cursorrules exists
Write-Host "1. Checking .cursorrules file..."
if (Test-Path ".cursorrules") {
    Write-Pass ".cursorrules exists"
    $content = Get-Content ".cursorrules" -Raw
    if ($content -match "MUST NOT" -and $content -match "ExternalApiClient") {
        Write-Pass ".cursorrules contains required rules"
    } else {
        Write-Fail ".cursorrules missing key rules"
    }
} else {
    Write-Fail ".cursorrules not found"
}
Write-Host ""

# Check 2: Monorepo structure
Write-Host "2. Checking monorepo structure..."
$requiredDirs = @("apps/web", "apps/api", "packages/foundation", "packages/shared")
$allExist = $true
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Pass "$dir exists"
    } else {
        Write-Fail "$dir missing"
        $allExist = $false
    }
}

if (Test-Path "package.json") {
    $pkgJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    if ($pkgJson.workspaces) {
        Write-Pass "Workspace configuration found"
    } else {
        Write-Fail "Workspace configuration missing"
    }
}
Write-Host ""

# Check 3: Docker Compose + Nginx
Write-Host "3. Checking Docker Compose + Nginx..."
if (Test-Path "infra/compose/docker-compose.yml") {
    Write-Pass "docker-compose.yml exists"
    $compose = Get-Content "infra/compose/docker-compose.yml" -Raw
    if ($compose -match "web:" -and $compose -match "api:" -and $compose -match "nginx:") {
        Write-Pass "All required services defined"
    } else {
        Write-Fail "Missing required services"
    }
} else {
    Write-Fail "docker-compose.yml not found"
}

if (Test-Path "infra/nginx/default.conf") {
    Write-Pass "Nginx config exists"
    $nginx = Get-Content "infra/nginx/default.conf" -Raw
    if ($nginx -match "location /api" -and $nginx -match "location /") {
        Write-Pass "Nginx routing configured"
    } else {
        Write-Fail "Nginx routing missing"
    }
} else {
    Write-Fail "Nginx config not found"
}
Write-Host ""

# Check 4: Next.js boundary enforcement
Write-Host "4. Checking Next.js boundary enforcement..."
if (Test-Path "apps/web/src/client-api/NexusApiClient.ts") {
    Write-Pass "NexusApiClient exists"
} else {
    Write-Fail "NexusApiClient not found"
}
Write-Host ""

# Check 5: Backend layering
Write-Host "5. Checking backend layering..."
$layeringFiles = @{
    "apps/api/src/search/search.controller.ts" = "searchFacade"
    "apps/api/src/search/search.facade.ts" = "orchestrator"
    "apps/api/src/search/search.orchestrator.ts" = "pipeline"
}

foreach ($file in $layeringFiles.Keys) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $pattern = $layeringFiles[$file]
        if ($content -match $pattern) {
            Write-Pass "$(Split-Path $file -Leaf) calls next layer"
        } else {
            Write-Fail "$(Split-Path $file -Leaf) does not call next layer"
        }
    } else {
        Write-Fail "$(Split-Path $file -Leaf) not found"
    }
}
Write-Host ""

# Check 6: Foundation primitives
Write-Host "6. Checking foundation primitives..."
$foundationFiles = @(
    "packages/foundation/src/errors/AppError.ts",
    "packages/foundation/src/result/Result.ts",
    "packages/foundation/src/logger/Logger.ts",
    "packages/foundation/src/external-api/ExternalApiClient.ts",
    "packages/foundation/src/idempotency/IdempotencyStore.ts"
)

foreach ($file in $foundationFiles) {
    if (Test-Path $file) {
        Write-Pass "$(Split-Path $file -Leaf) exists"
    } else {
        Write-Fail "$(Split-Path $file -Leaf) not found"
    }
}
Write-Host ""

# Check 7: ALS Context
Write-Host "7. Checking ALS Context implementation..."
if (Test-Path "apps/api/src/context/Context.ts") {
    $content = Get-Content "apps/api/src/context/Context.ts" -Raw
    if ($content -match "AsyncLocalStorage") {
        Write-Pass "Context uses AsyncLocalStorage"
    } else {
        Write-Fail "Context does not use AsyncLocalStorage"
    }
} else {
    Write-Fail "Context.ts not found"
}

if (Test-Path "apps/api/src/context/context.middleware.ts") {
    Write-Pass "ContextMiddleware exists"
} else {
    Write-Fail "ContextMiddleware not found"
}

if (Test-Path "apps/api/src/app.module.ts") {
    $content = Get-Content "apps/api/src/app.module.ts" -Raw
    if ($content -match "ContextMiddleware") {
        Write-Pass "ContextMiddleware registered in AppModule"
    } else {
        Write-Fail "ContextMiddleware not registered"
    }
}
Write-Host ""

# Check 8: Search flow
Write-Host "8. Checking search flow..."
if ((Test-Path "apps/api/src/search/search.controller.ts") -and (Test-Path "apps/web/src/app/search/page.tsx")) {
    Write-Pass "Search endpoints exist (backend + frontend)"
    $searchPage = Get-Content "apps/web/src/app/search/page.tsx" -Raw
    if ($searchPage -match "nexusApiClient") {
        Write-Pass "Frontend uses NexusApiClient"
    } else {
        Write-Fail "Frontend does not use NexusApiClient"
    }
} else {
    Write-Fail "Search flow incomplete"
}
Write-Host ""

# Check 9: Transaction watchdog
Write-Host "9. Checking transaction watchdog..."
if (Test-Path "apps/api/src/transaction/transaction.watchdog.ts") {
    $content = Get-Content "apps/api/src/transaction/transaction.watchdog.ts" -Raw
    if ($content -match "@Cron") {
        Write-Pass "TransactionWatchdog has cron job"
    } else {
        Write-Fail "TransactionWatchdog missing cron job"
    }
    if ($content -match "ALERT") {
        Write-Pass "TransactionWatchdog logs ALERT"
    } else {
        Write-Fail "TransactionWatchdog does not log ALERT"
    }
} else {
    Write-Fail "TransactionWatchdog not found"
}

if (Test-Path "apps/api/src/transaction/transaction.controller.ts") {
    $content = Get-Content "apps/api/src/transaction/transaction.controller.ts" -Raw
    if ($content -match "POST|@Post") {
        Write-Pass "Transaction controller has POST endpoint"
    } else {
        Write-Fail "Transaction controller missing POST endpoint"
    }
} else {
    Write-Fail "TransactionController not found"
}
Write-Host ""

# Summary
Write-Host "=========================================="
Write-Host "Summary"
Write-Host "=========================================="
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "All checks passed!" -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "$warnings warning(s)" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "$errors error(s), $warnings warning(s)" -ForegroundColor Red
    exit 1
}

