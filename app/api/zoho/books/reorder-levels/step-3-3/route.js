import { NextResponse } from "next/server";
import { BooksReorderLevelService } from "@/libs/zoho/services/books/BooksReorderLevelService";
import { Logger } from "@/libs/utils/logger";

/**
 * Step 3.3: Upload items array with sum qty into database
 * 
 * POST /api/zoho/books/reorder-levels/step-3-3
 * Body: { items: Array }
 */
export async function POST(req) {
  const requestLogs = [];
  const startTime = Date.now();

  try {
    // Log 1: Request received
    requestLogs.push(`[${new Date().toISOString()}] Step 3.3: Request received`);
    Logger.info("Step 3.3: Request received");

    // Log 2: Parse request body
    let body;
    try {
      body = await req.json();
      requestLogs.push(`[${new Date().toISOString()}] Body parsed successfully`);
      Logger.info("Step 3.3: Body parsed", {
        bodyKeys: Object.keys(body || {}),
        hasItems: Array.isArray(body?.items),
        itemsCount: Array.isArray(body?.items) ? body.items.length : 0,
      });
    } catch (parseError) {
      requestLogs.push(`[${new Date().toISOString()}] ERROR: Failed to parse body - ${parseError.message}`);
      Logger.error("Step 3.3: Failed to parse request body", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse request body",
          errorDetails: parseError.message,
          logs: requestLogs,
        },
        { status: 400 }
      );
    }

    // Log 3: Extract items from body
    const { items = [] } = body;
    requestLogs.push(`[${new Date().toISOString()}] Extracted items from body: ${items.length} items`);
    Logger.info("Step 3.3: Extracted items", {
      itemsCount: items.length,
      firstItem: items.length > 0 ? {
        sku: items[0].sku,
        item_id: items[0].item_id,
        name: items[0].name,
        quantity: items[0].quantity,
      } : null,
    });

    // Log 4: Validate items array
    if (!Array.isArray(items)) {
      requestLogs.push(`[${new Date().toISOString()}] ERROR: items is not an array (type: ${typeof items})`);
      Logger.error("Step 3.3: Validation failed - items is not an array", {
        itemsType: typeof items,
        itemsValue: items,
      });
      return NextResponse.json(
        {
          success: false,
          error: "items must be an array",
          receivedType: typeof items,
          logs: requestLogs,
        },
        { status: 400 }
      );
    }

    requestLogs.push(`[${new Date().toISOString()}] Validation passed: items is an array with ${items.length} items`);

    // Log 5: Create service instance
    requestLogs.push(`[${new Date().toISOString()}] Creating BooksReorderLevelService instance...`);
    const service = new BooksReorderLevelService();
    requestLogs.push(`[${new Date().toISOString()}] Service instance created`);

    // Log 6: Call service method
    requestLogs.push(`[${new Date().toISOString()}] Calling uploadItemsToDatabase with ${items.length} items...`);
    Logger.info("Step 3.3: Calling uploadItemsToDatabase", {
      itemsCount: items.length,
      itemSamples: items.slice(0, 3).map(item => ({
        sku: item.sku,
        item_id: item.item_id,
        quantity: item.quantity,
      })),
    });

    const result = await service.uploadItemsToDatabase(items);

    // Log 7: Service method completed
    const serviceDuration = Date.now() - startTime;
    requestLogs.push(`[${new Date().toISOString()}] Service method completed in ${serviceDuration}ms`);
    requestLogs.push(`[${new Date().toISOString()}] Service result: success=${result.success}, updated=${result.updated || 0}, errors=${result.errors?.length || 0}`);
    
    // Log detailed error information
    if (result.errors && result.errors.length > 0) {
      requestLogs.push(`[${new Date().toISOString()}] ERROR DETAILS: Found ${result.errors.length} errors`);
      result.errors.forEach((error, idx) => {
        requestLogs.push(`[${new Date().toISOString()}] Error ${idx + 1}: ${JSON.stringify(error)}`);
      });
      Logger.error("Step 3.3: Service method completed with errors", {
        errorCount: result.errors.length,
        errors: result.errors,
        firstError: result.errors[0],
      });
    }
    
    // Log details information
    if (result.details && result.details.length > 0) {
      requestLogs.push(`[${new Date().toISOString()}] DETAILS: Found ${result.details.length} item details`);
      Logger.info("Step 3.3: Service method details", {
        detailsCount: result.details.length,
        firstDetail: result.details[0],
      });
    }
    
    Logger.info("Step 3.3: Service method completed", {
      duration: serviceDuration,
      success: result.success,
      updated: result.updated,
      errorCount: result.errors?.length || 0,
      detailsCount: result.details?.length || 0,
      hasLogs: Array.isArray(result.logs),
      logCount: Array.isArray(result.logs) ? result.logs.length : 0,
      errors: result.errors,
      details: result.details,
    });

    // Log 8: Merge request logs with service logs
    const allLogs = [
      ...requestLogs,
      ...(Array.isArray(result.logs) ? result.logs : []),
    ];

    // Log 9: Prepare response
    const response = {
      ...result,
      logs: allLogs,
      requestMetadata: {
        itemsReceived: items.length,
        requestDuration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };

    requestLogs.push(`[${new Date().toISOString()}] Preparing response with ${allLogs.length} total logs`);
    Logger.info("Step 3.3: Preparing response", {
      responseKeys: Object.keys(response),
      totalLogs: allLogs.length,
      finalSuccess: response.success,
    });

    // Log 10: Return response
    const totalDuration = Date.now() - startTime;
    requestLogs.push(`[${new Date().toISOString()}] Returning response (total duration: ${totalDuration}ms)`);
    Logger.info("Step 3.3: Returning response", {
      totalDuration,
      status: response.success ? 200 : 500,
    });

    return NextResponse.json(response);

  } catch (error) {
    const errorDuration = Date.now() - startTime;
    requestLogs.push(`[${new Date().toISOString()}] EXCEPTION: ${error.message}`);
    requestLogs.push(`[${new Date().toISOString()}] Exception stack: ${error.stack}`);
    
    Logger.error("Step 3.3: Exception occurred", error, {
      duration: errorDuration,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred",
        errorName: error.name,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        logs: requestLogs,
        requestMetadata: {
          requestDuration: errorDuration,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
