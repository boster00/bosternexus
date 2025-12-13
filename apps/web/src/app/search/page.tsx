'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { nexusApiClient } from '@/client-api/NexusApiClient';
import { SearchResponse } from '@bosternexus/shared';
import Link from 'next/link';
import styles from './page.module.css';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <h1>BosterNexus</h1>
        </Link>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/services">Services</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.searchHeader}>
          <h2>Search Results</h2>
          {query && <p>Searching for: &quot;{query}&quot;</p>}
        </div>

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>Error: {error}</div>}

        {results && (
          <div className={styles.results}>
            <p className={styles.resultCount}>
              Found {results.total} result{results.total !== 1 ? 's' : ''}
            </p>
            <div className={styles.resultsGrid}>
              {results.results.map((item) => (
                <div key={item.id} className={styles.resultCard}>
                  {item.imageUrl && (
                    <div className={styles.resultImage}>{item.category}</div>
                  )}
                  <h3>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                  {item.category && (
                    <span className={styles.category}>{item.category}</span>
                  )}
                  {item.price && (
                    <div className={styles.price}>${item.price.toFixed(2)}</div>
                  )}
                  <Link href={`/products/${item.id}`} className={styles.viewButton}>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && results && results.results.length === 0 && (
          <div className={styles.noResults}>
            <p>No results found for &quot;{query}&quot;</p>
            <Link href="/">Return to Home</Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
