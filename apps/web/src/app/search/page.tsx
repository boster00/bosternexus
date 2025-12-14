'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { nexusApiClient } from '@/client-api/NexusApiClient';
import { SearchResponse } from '@bosternexus/shared';
import Link from 'next/link';

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
        .search(query)
        .then(setResults)
        .catch((err) => {
          setError(err.message);
          console.error('Search error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Boster Bio
          </Link>
          <nav className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Search Results</h2>
          {query && <p className="text-gray-600">Searching for: &quot;{query}&quot;</p>}
        </div>

        {loading && <div className="text-center py-8">Loading...</div>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        {results && (
          <div>
            <p className="text-gray-600 mb-6">
              Found {results.total} result{results.total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.results.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  {item.imageUrl && (
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded mb-4 flex items-center justify-center text-blue-600 font-semibold">
                      {item.category || 'Product'}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  {item.category && (
                    <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs mb-2">
                      {item.category}
                    </span>
                  )}
                  {item.price && (
                    <div className="text-xl font-bold text-blue-600 mb-4">
                      ${item.price.toFixed(2)}
                    </div>
                  )}
                  <Link
                    href={`/products/${item.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && results && results.results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No results found for &quot;{query}&quot;</p>
            <Link href="/" className="text-blue-600 font-semibold underline">
              Return to Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

