import { NextResponse } from 'next/server';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { getAllBicArticles, getBicArticleByUrl, createBicArticle } from '@/libs/db/bic';
import { Logger } from '@/libs/utils/logger';
import { hasArticleAccess } from '@/libs/utils/whitelist';

/**
 * GET /api/bic/articles
 * - GET /api/bic/articles?url=project-management/pipeline-system - Get single article by URL
 * - GET /api/bic/articles - List all BIC articles (filtered by access)
 */
export async function GET(req) {
  try {
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });

    const user = await dal.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    // If URL parameter is provided, get single article
    if (url) {
      const { data: article, error } = await getBicArticleByUrl(url);

      if (error) {
        Logger.error('[bic/articles] Error fetching article by URL', error);
        return NextResponse.json(
          { error: error.message || 'Failed to fetch article' },
          { status: 500 }
        );
      }

      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }

      // Check access
      if (!hasArticleAccess(user.email, article.is_whitelist_only)) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        article,
      });
    }

    // Otherwise, get all articles
    const { data: allArticles, error } = await getAllBicArticles();

    if (error) {
      Logger.error('[bic/articles] Error fetching articles', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    // Filter articles based on user access
    const accessibleArticles = allArticles.filter(article => {
      return hasArticleAccess(user.email, article.is_whitelist_only);
    });

    Logger.info('[bic/articles] Articles fetched', {
      total: allArticles.length,
      accessible: accessibleArticles.length,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      articles: accessibleArticles,
    });
  } catch (error) {
    Logger.error('[bic/articles] Request error', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bic/articles
 * Create a new BIC article
 */
export async function POST(req) {
  try {
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });

    const user = await dal.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, url, html_content, is_whitelist_only } = body;

    // Validation
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Validate URL format (slug: lowercase, alphanumeric, hyphens, underscores)
    const urlRegex = /^[a-z0-9_-]+$/;
    if (!urlRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL must be a valid slug (lowercase letters, numbers, hyphens, underscores only)' },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const { data: existing } = await dal.getSingle('bic_articles', { url });
    if (existing) {
      return NextResponse.json(
        { error: 'An article with this URL already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await createBicArticle(
      {
        name,
        url,
        html_content: html_content || '',
        is_whitelist_only: is_whitelist_only || false,
      },
      user.id
    );

    if (error) {
      Logger.error('[bic/articles] Error creating article', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create article' },
        { status: 500 }
      );
    }

    Logger.info('[bic/articles] Article created', {
      articleId: data.id,
      url: data.url,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      article: data,
    });
  } catch (error) {
    Logger.error('[bic/articles] Request error', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

