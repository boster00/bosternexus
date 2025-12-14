# Verification Guide

This document provides commands to verify the security-first architecture is working correctly.

## Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Build shared packages:
```bash
npm run build --workspace=packages/shared
npm run build --workspace=packages/foundation
```

## Local Development

### Start Services

**Option 1: Individual services**
```bash
# Terminal 1: API
npm run api:dev

# Terminal 2: Web
npm run web:dev
```

**Option 2: Docker Compose**
```bash
npm run dev
```

## Verification Commands

### 1. Health Endpoint
```bash
curl http://localhost:8080/api/health
```

**Expected Response:**
```json
{
  "ok": true,
  "version": "1.0.0",
  "requestId": "uuid-here",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Search Endpoint (Valid Request)
```bash
curl "http://localhost:8080/api/search?q=bdnf&page=1&limit=20"
```

**Expected Response:**
```json
{
  "query": "bdnf",
  "results": [...],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

### 3. Search Endpoint (Invalid Request - Strict Validation)
```bash
curl "http://localhost:8080/api/search?q=bdnf&unknownKey=value"
```

**Expected Response:**
- Status: `400 Bad Request`
- Body contains validation errors showing `unknownKey` was rejected

### 4. Transaction Endpoint (Valid Request)
```bash
curl -X POST http://localhost:8080/api/transactions/start \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-123" \
  -d '{"purpose": "checkout", "metadata": {}}'
```

**Expected Response:**
```json
{
  "transaction": {
    "id": "uuid-here",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "state": "INITIATED",
    "metadata": {},
    "lastUpdatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Transaction Endpoint (Missing Idempotency Key)
```bash
curl -X POST http://localhost:8080/api/transactions/start \
  -H "Content-Type: application/json" \
  -d '{"purpose": "checkout"}'
```

**Expected Response:**
- Status: `400 Bad Request`
- Error message indicates `Idempotency-Key` header is required

### 6. Transaction Endpoint (Invalid Payload - Unknown Keys)
```bash
curl -X POST http://localhost:8080/api/transactions/start \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-456" \
  -d '{"purpose": "checkout", "unknownField": "value"}'
```

**Expected Response:**
- Status: `400 Bad Request`
- Validation errors show `unknownField` was rejected (strict mode)

### 7. Frontend Search Page
Open in browser:
```
http://localhost:8080/search?q=bdnf
```

**Expected:**
- Page loads and displays search results
- All API calls go through `NexusApiClient`
- No direct fetch calls in page components

## Architecture Verification

### Check for Boundary Violations

**1. No direct imports from API in web:**
```bash
# Should return no results
grep -r "from.*apps/api" apps/web/src
```

**2. All API calls use NexusApiClient:**
```bash
# Should show only NexusApiClient usage
grep -r "fetch\|axios" apps/web/src --exclude="NexusApiClient.ts"
```

**3. Context only used in allowed layers:**
```bash
# Check API context usage (should be in controllers/facades/orchestrators only)
grep -r "Context.current" apps/api/src
```

## Security Verification

### Strict Validation Test

Create a test file `test-validation.sh`:

```bash
#!/bin/bash

echo "Testing strict validation..."

# Test 1: Unknown key rejection
echo "Test 1: Unknown key in search query"
curl -s "http://localhost:8080/api/search?q=test&unknownKey=value" | jq .

# Test 2: Invalid type
echo "Test 2: Invalid type (page as string)"
curl -s "http://localhost:8080/api/search?q=test&page=invalid" | jq .

# Test 3: Missing required field
echo "Test 3: Missing required field (purpose)"
curl -s -X POST http://localhost:8080/api/transactions/start \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test" \
  -d '{}' | jq .

echo "All tests should return 400 Bad Request with validation errors"
```

Run: `chmod +x test-validation.sh && ./test-validation.sh`

## Expected Behavior Summary

✅ **Strict Validation**: All endpoints reject unknown keys  
✅ **Idempotency**: Transaction endpoints require idempotency keys  
✅ **Context**: Request context available in controllers/facades  
✅ **Boundaries**: Frontend only calls API via NexusApiClient  
✅ **Security Headers**: Nginx adds security headers  
✅ **Rate Limiting**: API endpoints have rate limits  

