# BosterNexus Architecture Guide: How Pages & Layouts Work

## Overview

You're using **Next.js 14 App Router**, which is similar to your old `page.js`/`layout.js` structure, but with some important architectural differences enforced by our `.cursorrules`.

---

## 1. File Structure (App Router)

```
apps/web/src/app/
├── layout.tsx          ← Root layout (wraps all pages)
├── page.tsx            ← Homepage (/)
├── globals.css          ← Global styles
└── search/
    └── page.tsx         ← Search page (/search)
```

**Key Point**: The file structure **IS** the routing structure:
- `app/page.tsx` → `/` (homepage)
- `app/search/page.tsx` → `/search`
- `app/products/page.tsx` → `/products` (if it existed)

This is the same concept as your old `page.js` files!

---

## 2. Layout.tsx (Root Layout)

```1:19:apps/web/src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BosterNexus - Life Science Research Products',
  description: 'High-quality antibodies, proteins, and ELISA kits for life science research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**What it does:**
- Wraps **all pages** in your app
- Sets global metadata (SEO)
- Loads global CSS
- Provides the `<html>` and `<body>` tags

**Similar to your old `layout.js`**: It's the wrapper that applies to every page.

---

## 3. Page.tsx (Homepage)

```1:16:apps/web/src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
```

**Key Differences from Old Structure:**

### A) `'use client'` Directive

This tells Next.js: **"This component runs on the client (browser)"**

- **Server Components** (default): Run on server, can't use hooks/state
- **Client Components** (`'use client'`): Run in browser, can use React hooks

**Why we need it**: The homepage uses `useState` for the search input, so it must be a client component.

### B) **NO Business Logic in Pages**

Notice what the page **does NOT** do:
- ❌ No direct database queries
- ❌ No direct API calls with `fetch()`
- ❌ No business logic (calculations, data transformations)
- ❌ No imports from `apps/api/**`

**What it DOES do:**
- ✅ UI rendering (JSX)
- ✅ User interactions (form handling, navigation)
- ✅ Calls `nexusApiClient` methods (the only allowed way to talk to backend)

---

## 4. The Client-API Layer (The Key Mechanism)

This is the **new mechanism** that replaces direct backend calls:

```1:38:apps/web/src/client-api/NexusApiClient.ts
import { SearchRequest, SearchResponse } from '@bosternexus/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class NexusApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async search(input: SearchRequest): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: input.q,
      ...(input.p && { p: input.p.toString() }),
      ...(input.limit && { limit: input.limit.toString() }),
    });

    return this.request<SearchResponse>(`/search?${params.toString()}`);
  }
}

export const nexusApiClient = new NexusApiClient();
```

**This is the ONLY place** where `fetch()` is allowed in the frontend!

---

## 5. Example: Search Page Flow

Let's trace how the search page works:

### Step 1: User visits `/search?q=bdnf`

### Step 2: Page Component Renders

```17:30:apps/web/src/app/search/page.tsx
  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      nexusApiClient
        .search({ q: query })
        .then(setResults)
        .catch((err) => {
          setError(err.message);
          console.error('Search error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);
```

**What happens:**
1. Page reads query from URL (`useSearchParams()`)
2. Calls `nexusApiClient.search()` ← **Only allowed way to call backend**
3. Updates React state with results
4. Renders UI based on state

### Step 3: NexusApiClient Makes HTTP Request

```27:35:apps/web/src/client-api/NexusApiClient.ts
  async search(input: SearchRequest): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: input.q,
      ...(input.p && { p: input.p.toString() }),
      ...(input.limit && { limit: input.limit.toString() }),
    });

    return this.request<SearchResponse>(`/search?${params.toString()}`);
  }
```

This calls: `http://localhost:8080/api/search?q=bdnf`

### Step 4: Backend Processes Request

The NestJS API receives the request and processes it through the layered architecture (Controller → Facade → Orchestrator → Pipeline).

### Step 5: Response Returns to Page

The page receives the `SearchResponse` and renders the results.

---

## 6. Architecture Rules (Why This Structure?)

From `.cursorrules`:

```
## A) Repo boundaries
- Next.js pages/layouts/routes MUST NOT implement business logic.
- Next.js pages/layouts/routes may only call `/src/client-api/*` methods
- Next.js code MUST NOT import from `apps/api/**` or any backend internal folders.
```

**Why?**
- **Separation of Concerns**: Frontend handles UI, backend handles business logic
- **Maintainability**: Changes to backend don't break frontend
- **Testability**: Can test frontend and backend independently
- **Scalability**: Can swap out backend implementation without touching frontend

---

## 7. Comparison: Old vs New

### Old Structure (What You Had)
```javascript
// page.js
export default function Page() {
  // ❌ Business logic mixed with UI
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // ❌ Direct fetch/API calls in page
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  // ❌ Data transformations in page
  const processed = data.map(item => ({
    ...item,
    calculated: item.price * 1.1
  }));
  
  return <div>{/* render */}</div>;
}
```

### New Structure (What We Have)
```typescript
// page.tsx
'use client';

export default function Page() {
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    // ✅ Only calls client-api methods
    nexusApiClient.search({ q: query })
      .then(setResults);
  }, [query]);
  
  // ✅ Only UI rendering, no business logic
  return <div>{/* render results */}</div>;
}
```

**Business logic moved to:**
- `NexusApiClient` (API communication)
- Backend (NestJS) - all calculations, data processing

---

## 8. Creating a New Page

To create a new page (e.g., `/products`):

1. **Create the file**: `apps/web/src/app/products/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { nexusApiClient } from '@/client-api/NexusApiClient';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ✅ Only way to call backend
    nexusApiClient.getProducts()
      .then(setProducts);
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

2. **Add method to NexusApiClient**:

```typescript
// apps/web/src/client-api/NexusApiClient.ts
async getProducts(): Promise<Product[]> {
  return this.request<Product[]>('/products');
}
```

3. **Create backend endpoint** (in NestJS):
   - Controller → Facade → Orchestrator → Pipeline

---

## 9. Key Takeaways

1. **File structure = Routing**: `app/products/page.tsx` → `/products`
2. **Layout wraps all pages**: `layout.tsx` applies to every route
3. **`'use client'` needed for**: Hooks, state, browser APIs
4. **Pages are UI-only**: No business logic, only rendering
5. **All backend calls go through**: `NexusApiClient` (single source of truth)
6. **Never import from**: `apps/api/**` in frontend code

---

## 10. Visual Flow Diagram

```
User Action
    ↓
Page Component (page.tsx)
    ↓
nexusApiClient.search()  ← Only allowed way
    ↓
HTTP Request to /api/search
    ↓
Nginx Reverse Proxy (port 8080)
    ↓
NestJS API (port 4000)
    ↓
Controller → Facade → Orchestrator → Pipeline
    ↓
Business Logic Processing
    ↓
Response (JSON)
    ↓
nexusApiClient returns data
    ↓
Page updates state
    ↓
UI re-renders with results
```

---

## Questions?

- **Q: Can I put business logic in pages?**  
  A: No. Use `NexusApiClient` to call backend, which handles all business logic.

- **Q: Can I use `fetch()` directly in pages?**  
  A: No. Only `NexusApiClient` can use `fetch()`. Pages call `nexusApiClient` methods.

- **Q: How do I add a new API endpoint?**  
  A: 1) Add method to `NexusApiClient`, 2) Create backend endpoint in NestJS, 3) Call from page.

- **Q: What if I need server-side rendering?**  
  A: Remove `'use client'` and use Next.js Server Components. But you still can't call backend directly - you'd need API routes or server actions.

