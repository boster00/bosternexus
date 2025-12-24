import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBicPagesByCategory, getBicArticleByUrl } from '@/libs/db/bic';
import BicPageContent from '@/components/bic/BicPageContent';
import BicEditPage from '@/components/bic/BicEditPage';
import BicLayoutClient from '@/components/bic/BicLayoutClient';

export const dynamic = 'force-dynamic';

/**
 * BIC Page - Dynamic route handler for /bic/[[...slug]]
 * Supports multiple path layers, e.g.:
 * - /bic (home page - when slug is empty)
 * - /bic/overview/boster-info-center
 * - /bic/project-management/pipeline-system
 * - /bic/customer-support/dz-antibody-response/edit (edit mode)
 */
export default async function BicPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];
  
  // Check if last segment is 'edit'
  const isEditMode = slug.length > 0 && slug[slug.length - 1] === 'edit';
  const actualSlug = isEditMode ? slug.slice(0, -1) : slug;
  
  // Load navigation structure
  const pagesByCategory = await getBicPagesByCategory();
  
  // If slug is empty, show home page
  if (actualSlug.length === 0) {
    const homeContent = (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Boster Info Center</h1>
          <p className="text-lg opacity-70">
            Internal content management system for articles and documentation.
          </p>
        </div>

        {/* Articles by Category */}
        <div className="space-y-6">
          {Object.entries(pagesByCategory).map(([category, pages]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/bic/${page.url}`}
                    className="card card-border bg-base-100 p-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold mb-2">{page.name}</h3>
                    {page.tags && Array.isArray(page.tags) && page.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {page.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="badge badge-sm badge-outline">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <BicLayoutClient pagesByCategory={pagesByCategory}>
        {homeContent}
      </BicLayoutClient>
    );
  }

  // Otherwise, show the specific page or edit mode
  const urlSlug = actualSlug.join('/');
  const { data: article, error } = await getBicArticleByUrl(urlSlug);

  if (error || !article) {
    notFound();
  }

  // If edit mode, show edit page
  if (isEditMode) {
    return (
      <BicLayoutClient pagesByCategory={pagesByCategory}>
        <BicEditPage article={article} />
      </BicLayoutClient>
    );
  }

  // Otherwise show the article
  return (
    <BicLayoutClient pagesByCategory={pagesByCategory}>
      <BicPageContent article={article} />
    </BicLayoutClient>
  );
}

