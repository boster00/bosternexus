import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { Logger } from "@/libs/utils/logger";

/**
 * API route to fetch Zoho Books items by SKU list
 * 
 * POST /api/zoho/books/items/by-skus
 * Body: { skus: string[] }
 */
export async function POST(req) {
  const startTime = Date.now();
  
  try {
    Logger.info('[by-skus] Request received');
    
    const body = await req.json();
    const { skus } = body;

    Logger.info('[by-skus] Request body parsed', {
      hasSkus: !!skus,
      skusType: Array.isArray(skus) ? 'array' : typeof skus,
      skusLength: Array.isArray(skus) ? skus.length : 'N/A',
      skusPreview: Array.isArray(skus) 
        ? JSON.stringify(skus).substring(0, 300)
        : JSON.stringify(skus).substring(0, 300),
      bodyPreview: JSON.stringify(body).substring(0, 300)
    });

    if (!Array.isArray(skus) || skus.length === 0) {
      Logger.warn('[by-skus] Validation failed: invalid skus array', {
        skusType: typeof skus,
        isArray: Array.isArray(skus),
        length: Array.isArray(skus) ? skus.length : 'N/A'
      });
      return NextResponse.json(
        { error: "skus must be a non-empty array" },
        { status: 400 }
      );
    }

    Logger.info('[by-skus] Validation passed', {
      skusCount: skus.length,
      first10Skus: skus.slice(0, 10),
      last10Skus: skus.slice(-10)
    });

    // Use DAL to fetch items
    Logger.info('[by-skus] Creating DAL instance');
    const dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false,
      autoTimestamps: false,
    });

    // Batch queries to avoid URL length limits
    // PostgREST has a limit of ~1000 items for .in() filters, but HTTP URLs have a ~2048 char limit
    // With URL encoding, 100 SKUs creates ~1500-2000 char URLs, so we use 100 as a safe batch size
    const BATCH_SIZE = 100;
    const allItems = [];
    const errors = [];
    
    Logger.info('[by-skus] Executing batched database queries', {
      table: 'zoho_books_items',
      skusCount: skus.length,
      batchSize: BATCH_SIZE,
      totalBatches: Math.ceil(skus.length / BATCH_SIZE),
      queryPreview: `SELECT zoho_id, sku, name, reorder_level, stock_on_hand, available_stock WHERE sku IN (batched, ${skus.length} total items) ORDER BY sku ASC`
    });
    
    const queryStartTime = Date.now();
    
    // Process SKUs in batches
    for (let i = 0; i < skus.length; i += BATCH_SIZE) {
      const skuBatch = skus.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(skus.length / BATCH_SIZE);
      
      Logger.info(`[by-skus] Processing batch ${batchNum}/${totalBatches}`, {
        batchNum,
        totalBatches,
        batchSize: skuBatch.length,
        firstSku: skuBatch[0],
        lastSku: skuBatch[skuBatch.length - 1],
      });
      
      try {
        const { data: batchItems, error: batchError } = await dal.select(
          'zoho_books_items',
          {
            queryBuilder: (query) => {
              return query
                .select('zoho_id, sku, name, reorder_level, stock_on_hand, available_stock')
                .in('sku', skuBatch);
            },
          }
        );
        
        if (batchError) {
          Logger.error(`[by-skus] Error in batch ${batchNum}/${totalBatches}`, {
            batchNum,
            totalBatches,
            errorMessage: batchError.message,
            errorCode: batchError.code,
            errorDetails: batchError.details,
            errorHint: batchError.hint,
          });
          errors.push({
            batch: `${batchNum}/${totalBatches}`,
            error: batchError.message,
            skus: skuBatch,
          });
        } else if (batchItems) {
          allItems.push(...batchItems);
          Logger.info(`[by-skus] Batch ${batchNum}/${totalBatches} completed`, {
            batchNum,
            totalBatches,
            itemsFound: batchItems.length,
            totalItemsSoFar: allItems.length,
          });
        }
      } catch (batchException) {
        Logger.error(`[by-skus] Exception in batch ${batchNum}/${totalBatches}`, {
          batchNum,
          totalBatches,
          errorMessage: batchException.message,
          errorStack: batchException.stack,
        });
        errors.push({
          batch: `${batchNum}/${totalBatches}`,
          error: batchException.message,
          skus: skuBatch,
        });
      }
    }
    
    const queryDuration = Date.now() - queryStartTime;
    
    // Sort all items by SKU (since we queried in batches)
    allItems.sort((a, b) => {
      const skuA = (a.sku || '').toUpperCase();
      const skuB = (b.sku || '').toUpperCase();
      return skuA.localeCompare(skuB);
    });

    Logger.info('[by-skus] All database queries completed', {
      queryDuration: `${queryDuration}ms`,
      totalBatches: Math.ceil(skus.length / BATCH_SIZE),
      totalItemsFound: allItems.length,
      errorCount: errors.length,
      itemsPreview: allItems.length > 0 ? JSON.stringify(allItems.slice(0, 3)).substring(0, 300) : 'null'
    });

    if (errors.length > 0 && allItems.length === 0) {
      // If all batches failed, return error
      Logger.error('[by-skus] All batches failed', {
        errorCount: errors.length,
        errors: errors,
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch items from all batches',
          batchErrors: errors,
        },
        { status: 500 }
      );
    }

    const response = {
      success: true,
      items: allItems,
      count: allItems.length,
      ...(errors.length > 0 && {
        warnings: {
          message: `${errors.length} batch(es) had errors but partial results are returned`,
          batchErrors: errors,
        },
      }),
    };

    const totalDuration = Date.now() - startTime;
    Logger.info('[by-skus] Request completed successfully', {
      totalDuration: `${totalDuration}ms`,
      queryDuration: `${queryDuration}ms`,
      itemsCount: allItems.length,
      errorCount: errors.length,
      responsePreview: JSON.stringify(response).substring(0, 300)
    });

    return NextResponse.json(response);

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    Logger.error('[by-skus] Request error', {
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
