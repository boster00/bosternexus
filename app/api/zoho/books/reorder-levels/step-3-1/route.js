import { NextResponse } from "next/server";
import { BooksReorderLevelService } from "@/libs/zoho/services/books/BooksReorderLevelService";
import { Logger } from "@/libs/utils/logger";

/**
 * Step 3.1: Get sample sales orders and their line items
 * 
 * GET /api/zoho/books/reorder-levels/step-3-1?limit=5
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "limit must be a number between 1 and 100" },
        { status: 400 }
      );
    }

    const service = new BooksReorderLevelService();
    const result = await service.getSampleSalesOrdersAndLineItems(limit);

    return NextResponse.json(result);

  } catch (error) {
    Logger.error("Error in Step 3.1", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred",
        logs: [`ERROR: ${error.message}`],
      },
      { status: 500 }
    );
  }
}
