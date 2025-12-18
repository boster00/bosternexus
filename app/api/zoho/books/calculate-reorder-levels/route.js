import { NextResponse } from "next/server";
import { BooksReorderLevelService } from "@/libs/zoho/services/books/BooksReorderLevelService";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { Logger } from "@/libs/utils/logger";

/**
 * API route for calculating and updating reorder levels for Zoho Books items
 * based on sales order line items within a look-back window.
 * 
 * POST /api/zoho/books/calculate-reorder-levels
 * Body: { lookBackDays?: number, inventoryTurnoverDays?: number }
 */
export async function POST(req) {
  const startTime = Date.now();
  
  try {
    Logger.info('[calculate-reorder-levels] Request received');
    
    const body = await req.json();
    const { lookBackDays = 180, inventoryTurnoverDays = 90 } = body;

    Logger.info('[calculate-reorder-levels] Request parameters', {
      lookBackDays,
      inventoryTurnoverDays,
      bodyKeys: Object.keys(body),
    });

    // Get current user using DAL
    Logger.info('[calculate-reorder-levels] Getting current user');
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();
    
    Logger.info('[calculate-reorder-levels] User retrieved', {
      userId: userId || 'null',
      hasUserId: !!userId,
    });

    // Validate parameters
    Logger.info('[calculate-reorder-levels] Validating parameters');
    if (typeof lookBackDays !== 'number' || lookBackDays < 1) {
      Logger.warn('[calculate-reorder-levels] Invalid lookBackDays', {
        lookBackDays,
        type: typeof lookBackDays,
      });
      return NextResponse.json(
        { error: "lookBackDays must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof inventoryTurnoverDays !== 'number' || inventoryTurnoverDays < 1) {
      Logger.warn('[calculate-reorder-levels] Invalid inventoryTurnoverDays', {
        inventoryTurnoverDays,
        type: typeof inventoryTurnoverDays,
      });
      return NextResponse.json(
        { error: "inventoryTurnoverDays must be a positive number" },
        { status: 400 }
      );
    }

    Logger.info('[calculate-reorder-levels] Parameters validated successfully');

    // Create service and calculate reorder levels
    Logger.info('[calculate-reorder-levels] Creating BooksReorderLevelService');
    const service = new BooksReorderLevelService();
    
    Logger.info('[calculate-reorder-levels] Starting reorder level calculation', {
      lookBackDays,
      inventoryTurnoverDays,
      userId: userId || 'null',
    });
    
    const calculationStartTime = Date.now();
    const result = await service.calculateAndUpdateReorderLevels(
      lookBackDays,
      inventoryTurnoverDays,
      userId
    );
    const calculationDuration = Date.now() - calculationStartTime;

    Logger.info('[calculate-reorder-levels] Calculation completed', {
      duration: `${calculationDuration}ms`,
      updated: result.updated,
      errorCount: result.errors.length,
      hasErrors: result.errors.length > 0,
      summary: result.summary,
    });

    if (result.errors.length > 0) {
      Logger.warn('[calculate-reorder-levels] Calculation completed with errors', {
        errorCount: result.errors.length,
        firstFewErrors: result.errors.slice(0, 3),
      });
    }

    const totalDuration = Date.now() - startTime;
    Logger.info('[calculate-reorder-levels] Request completed successfully', {
      totalDuration: `${totalDuration}ms`,
      calculationDuration: `${calculationDuration}ms`,
      updated: result.updated,
      errorCount: result.errors.length,
    });

    return NextResponse.json({
      success: result.errors.length === 0,
      ...result,
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    Logger.error("[calculate-reorder-levels] Error calculating reorder levels", error, {
      errorCode: error.code,
      errorDetails: error.details,
      errorHint: error.hint,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      totalDuration: `${totalDuration}ms`,
    });
    
    console.error('[calculate-reorder-levels] Full error details:', {
      error,
      errorType: typeof error,
      errorConstructor: error?.constructor?.name,
      errorKeys: Object.keys(error || {}),
      errorString: String(error),
      errorJSON: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      errorMessage: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details,
      errorHint: error?.hint,
      stack: error?.stack,
    });
    
    return NextResponse.json(
      {
        error: error.message || "An error occurred during reorder level calculation",
        errorCode: error.code,
        errorDetails: error.details,
        errorHint: error.hint,
        fullError: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
