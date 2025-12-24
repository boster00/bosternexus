import { NextResponse } from 'next/server';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { deleteBicArticle } from '@/libs/db/bic';
import { Logger } from '@/libs/utils/logger';

/**
 * DELETE /api/bic/articles/delete/[id]
 * Delete a BIC article
 */
export async function DELETE(req, { params }) {
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

    const { data, error } = await deleteBicArticle(articleId, user.id);

    if (error) {
      Logger.error('[bic/articles/delete/[id]] Error deleting article', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete article' },
        { status: error.message?.includes('Unauthorized') ? 403 : 500 }
      );
    }

    Logger.info('[bic/articles/delete/[id]] Article deleted', {
      articleId,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    Logger.error('[bic/articles/delete/[id]] Request error', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

