import { NextResponse } from 'next/server';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { updateBicArticle } from '@/libs/db/bic';
import { Logger } from '@/libs/utils/logger';

/**
 * PUT /api/bic/articles/update/[id]
 * Update a BIC article
 */
export async function PUT(req, { params }) {
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

    const articleId = params?.id;
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, url, html_content, is_whitelist_only } = body;

    // Build updates object (only include provided fields)
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (url !== undefined) {
      // Validate URL format
      const urlRegex = /^[a-z0-9_-]+$/;
      if (!urlRegex.test(url)) {
        return NextResponse.json(
          { error: 'URL must be a valid slug (lowercase letters, numbers, hyphens, underscores only)' },
          { status: 400 }
        );
      }
      updates.url = url;
    }
    if (html_content !== undefined) updates.html_content = html_content;
    if (is_whitelist_only !== undefined) updates.is_whitelist_only = is_whitelist_only;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // If URL is being updated, check if new URL already exists
    if (updates.url) {
      const { data: existing } = await dal.getSingle('bic_articles', { url: updates.url });
      if (existing && existing.id !== articleId) {
        return NextResponse.json(
          { error: 'An article with this URL already exists' },
          { status: 409 }
        );
      }
    }

    const { data, error } = await updateBicArticle(articleId, updates, user.id);

    if (error) {
      Logger.error('[bic/articles/update/[id]] Error updating article', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update article' },
        { status: error.message?.includes('Unauthorized') ? 403 : 500 }
      );
    }

    Logger.info('[bic/articles/update/[id]] Article updated', {
      articleId,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      article: data,
    });
  } catch (error) {
    Logger.error('[bic/articles/update/[id]] Request error', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

