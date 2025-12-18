import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { Logger } from "@/libs/utils/logger";
import { BooksReorderLevelService } from "@/libs/zoho/services/books/BooksReorderLevelService";

/**
 * API route to fetch Zoho Books items by SKU range
 * 
 * POST /api/zoho/books/items/by-sku-range
 * Body: { beginSku: string, endSku: string }
 */
export async function POST(req) {
  const startTime = Date.now();
  
  try {
    Logger.info('[by-sku-range] Request received');
    
    const body = await req.json();
    const { beginSku, endSku } = body;

    Logger.info('[by-sku-range] Request body parsed', {
      beginSku,
      endSku,
      bodyPreview: JSON.stringify(body).substring(0, 300)
    });

    if (!beginSku || !endSku) {
      Logger.warn('[by-sku-range] Validation failed: missing SKU range', {
        beginSku,
        endSku,
      });
      return NextResponse.json(
        { error: "beginSku and endSku are required" },
        { status: 400 }
      );
    }

    if (beginSku > endSku) {
      Logger.warn('[by-sku-range] Validation failed: beginSku > endSku', {
        beginSku,
        endSku,
      });
      return NextResponse.json(
        { error: "beginSku must be less than or equal to endSku" },
        { status: 400 }
      );
    }

    Logger.info('[by-sku-range] Validation passed', {
      beginSku,
      endSku,
    });

    // Use DAL to fetch items
    Logger.info('[by-sku-range] Creating DAL instance');
    const dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false,
      autoTimestamps: false,
    });

    // Query items where SKU is between beginSku and endSku (inclusive)
    Logger.info('[by-sku-range] Executing database query', {
      table: 'zoho_books_items',
      beginSku,
      endSku,
      queryPreview: `SELECT zoho_id, sku, name, reorder_level, stock_on_hand WHERE sku >= '${beginSku}' AND sku <= '${endSku}' ORDER BY sku ASC`
    });
    
    const queryStartTime = Date.now();
    const { data: items, error } = await dal.select(
      'zoho_books_items',
      {
        columns: 'zoho_id, sku, name, reorder_level, stock_on_hand',
        queryBuilder: (query) => {
          return query
            .gte('sku', beginSku)
            .lte('sku', endSku)
            .order('sku', { ascending: true });
        },
      }
    );
    const queryDuration = Date.now() - queryStartTime;

    Logger.info('[by-sku-range] Database query completed', {
      queryDuration: `${queryDuration}ms`,
      hasError: !!error,
      hasData: !!items,
      itemsCount: items?.length || 0,
      errorMessage: error?.message,
      errorCode: error?.code,
      itemsPreview: items ? JSON.stringify(items.slice(0, 3)).substring(0, 300) : 'null'
    });

    if (error) {
      Logger.error('[by-sku-range] Database query error', {
        errorMessage: error.message,
        errorCode: error.code,
        errorDetails: error.details,
        errorHint: error.hint,
        errorPreview: JSON.stringify(error).substring(0, 300)
      });
      return NextResponse.json(
        { error: error.message || 'Failed to fetch items' },
        { status: 500 }
      );
    }

    // Filter items using isKeepStock validation
    // This ensures only items that meet the SKU format and keep-stock criteria are returned
    const reorderService = new BooksReorderLevelService();
    const allItems = items || [];
    const filteredItems = allItems.filter(item => {
      const isValid = reorderService.isKeepStock({
        sku: item.sku,
        name: item.name,
        purchase_description: null, // Not available in this query
      });
      return isValid;
    });

    const filteredCount = allItems.length - filteredItems.length;
    if (filteredCount > 0) {
      Logger.info('[by-sku-range] Filtered items using isKeepStock', {
        totalItems: allItems.length,
        filteredItems: filteredItems.length,
        removedCount: filteredCount,
        removedSkus: allItems
          .filter(item => !reorderService.isKeepStock({
            sku: item.sku,
            name: item.name,
            purchase_description: null,
          }))
          .map(item => item.sku)
          .slice(0, 10) // Log first 10 removed SKUs
      });
    }

    const response = {
      success: true,
      items: filteredItems,
      count: filteredItems.length,
      totalBeforeFilter: allItems.length,
      filteredOut: filteredCount,
    };

    const totalDuration = Date.now() - startTime;
    Logger.info('[by-sku-range] Request completed successfully', {
      totalDuration: `${totalDuration}ms`,
      queryDuration: `${queryDuration}ms`,
      itemsCount: items?.length || 0,
      responsePreview: JSON.stringify(response).substring(0, 300)
    });

    return NextResponse.json(response);

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    Logger.error('[by-sku-range] Request error', {
      errorMessage: error.message,
      errorStack: error.stack,
      errorPreview: JSON.stringify(error).substring(0, 300),
      totalDuration: `${totalDuration}ms`
    });
    return NextResponse.json(
      {
        error: error.message || "An error occurred while fetching items",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
