import Link from 'next/link';

export default function BicPageContent({ article }) {
  return (
    <article className="prose max-w-none">
      {/* Page Header */}
      <header className="mb-8 pb-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{article.name}</h1>
            {article.is_whitelist_only && (
              <div className="alert alert-warning mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>This page contains restricted information.</span>
              </div>
            )}
          </div>
          <Link href={`/bic/${article.url}/edit`} className="btn btn-sm btn-primary">
            Edit
          </Link>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm opacity-70">
          {article.category && (
            <div>
              <span className="font-semibold">Category:</span> {article.category}
            </div>
          )}
          {article.owners && Array.isArray(article.owners) && article.owners.length > 0 && (
            <div>
              <span className="font-semibold">Owners:</span>{' '}
              {article.owners.join(', ')}
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <span key={tag} className="badge badge-outline">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Page Content */}
      <div 
        className="mb-8"
        dangerouslySetInnerHTML={{ __html: article.html_content || '<p>No content yet.</p>' }}
      />

      {/* Sources Section */}
      {article.source_urls && Array.isArray(article.source_urls) && article.source_urls.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Sources</h2>
          <ul className="list-disc list-inside space-y-2">
            {article.source_urls.map((url, index) => (
              <li key={index}>
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  {url}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

