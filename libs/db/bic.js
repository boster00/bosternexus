/**
 * Database functions for BIC articles (using bic_articles table)
 * Uses DAL for RLS-compliant operations
 */

import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';

/**
 * Get all BIC articles
 */
export async function getAllBicArticles() {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.select('bic_articles', {
      orderBy: { column: 'updated_at', ascending: false },
    });

    if (error) {
      Logger.error('[bic] Error fetching all articles', error);
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    Logger.error('[bic] Exception fetching all articles', error);
    return { data: [], error };
  }
}

/**
 * Get a single BIC article by URL slug
 * URL format: category/page or category/subcategory/page
 */
export async function getBicArticleByUrl(url) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    // Remove /bic prefix if present, keep just the slug
    const urlSlug = url.startsWith('/bic/') ? url.replace('/bic/', '') : url.replace(/^\//, '');
    
    const data = await dal.getSingle('bic_articles', {
      url: urlSlug,
    });

    return { data, error: null };
  } catch (error) {
    Logger.error('[bic] Exception fetching article by URL', error, {
      url,
    });
    return { data: null, error };
  }
}

/**
 * Get pages grouped by category
 */
export async function getBicPagesByCategory() {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.select('bic_articles', {
      orderBy: { column: 'category', ascending: true },
    });

    if (error) {
      Logger.error('[bic] Error fetching articles by category', error);
      throw error;
    }

    // Group by category and sort within each category
    const grouped = {};
    (data || []).forEach((article) => {
      const category = article.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(article);
    });

    // Sort articles within each category by order, then by name
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => {
        // First by order field (if exists)
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        // Then by name
        return (a.name || '').localeCompare(b.name || '');
      });
    });

    return grouped;
  } catch (error) {
    Logger.error('[bic] Exception fetching articles by category', error);
    return {};
  }
}

/**
 * Get all unique tags from BIC articles
 */
export async function getAllBicTags() {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.select('bic_articles', {});

    if (error) {
      Logger.error('[bic] Error fetching tags', error);
      throw error;
    }

    const tagSet = new Set();
    (data || []).forEach((article) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag) => tagSet.add(tag));
      }
    });

    return Array.from(tagSet).sort();
  } catch (error) {
    Logger.error('[bic] Exception fetching tags', error);
    return [];
  }
}

/**
 * Build search index from BIC articles
 */
export async function buildBicSearchIndex() {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.select('bic_articles', {});

    if (error) {
      Logger.error('[bic] Error building search index', error);
      throw error;
    }

    const index = (data || []).map((article) => {
      // Strip HTML tags for search
      const plainText = (article.html_content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const tagsText = (article.tags || []).join(' ');
      const ownersText = (article.owners || []).join(' ');

      return {
        id: article.id,
        title: article.name || '',
        category: article.category || '',
        tags: article.tags || [],
        content: plainText,
        searchableText: `${article.name} ${article.category} ${tagsText} ${ownersText} ${plainText}`.toLowerCase(),
        url: `/bic/${article.url}`,
      };
    });

    return index;
  } catch (error) {
    Logger.error('[bic] Exception building search index', error);
    return [];
  }
}

/**
 * Create a new BIC article
 */
export async function createBicArticle(articleData, userId) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: true,
    autoTimestamps: true,
  });

  try {
    const { data, error } = await dal.insert('bic_articles', {
      ...articleData,
      created_by: userId,
    });

    if (error) {
      Logger.error('[bic] Error creating article', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    Logger.error('[bic] Exception creating article', error, {
      userId,
      articleData: { ...articleData, html_content: '[redacted]' },
    });
    return { data: null, error };
  }
}

/**
 * Delete a BIC article
 */
export async function deleteBicArticle(articleId, userId) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    // First verify the user owns this article
    const existing = await dal.getSingle('bic_articles', {
      id: articleId,
    });

    if (!existing) {
      const error = new Error('Article not found');
      Logger.error('[bic] Article not found for delete', error, {
        articleId,
        userId,
      });
      return { data: null, error };
    }

    if (existing.created_by !== userId) {
      const error = new Error('Unauthorized: You can only delete articles you created');
      Logger.error('[bic] Unauthorized delete attempt', error, {
        articleId,
        userId,
        articleOwner: existing.created_by,
      });
      return { data: null, error };
    }

    const { error } = await dal.delete('bic_articles', {
      id: articleId,
    });

    if (error) {
      Logger.error('[bic] Error deleting article', error);
      throw error;
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    Logger.error('[bic] Exception deleting article', error, {
      articleId,
      userId,
    });
    return { data: null, error };
  }
}

/**
 * Update a BIC article
 */
export async function updateBicArticle(articleId, updates, userId) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: true,
  });

  try {
    // First verify the user owns this article
    const existing = await dal.getSingle('bic_articles', {
      id: articleId,
    });

    if (!existing) {
      const error = new Error('Article not found');
      Logger.error('[bic] Article not found for update', error, {
        articleId,
        userId,
      });
      return { data: null, error };
    }

    if (existing.created_by !== userId) {
      const error = new Error('Unauthorized: You can only update articles you created');
      Logger.error('[bic] Unauthorized update attempt', error, {
        articleId,
        userId,
        articleOwner: existing.created_by,
      });
      return { data: null, error };
    }

    const { data, error } = await dal.update('bic_articles', updates, {
      id: articleId,
    });

    if (error) {
      Logger.error('[bic] Error updating article', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    Logger.error('[bic] Exception updating article', error, {
      articleId,
      userId,
    });
    return { data: null, error };
  }
}

