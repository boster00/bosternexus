import { NextResponse } from "next/server";
import { BooksReorderLevelService } from "@/libs/zoho/services/books/BooksReorderLevelService";
import { Logger } from "@/libs/utils/logger";

/**
 * Step 3.2: Summarize line items into items array with sum qty and calculate reorder levels
 * 
 * POST /api/zoho/books/reorder-levels/step-3-2
 * Body: { lineItems: Array, maxQuantity?: number, lookBackDays?: number, inventoryTurnoverDays?: number }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      lineItems = [], 
      maxQuantity = 5,
      lookBackDays = 180,
      inventoryTurnoverDays = 90
    } = body;

    if (!Array.isArray(lineItems)) {
      return NextResponse.json(
        { error: "lineItems must be an array" },
        { status: 400 }
      );
    }

    if (typeof maxQuantity !== 'number' || maxQuantity < 1) {
      return NextResponse.json(
        { error: "maxQuantity must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof lookBackDays !== 'number' || lookBackDays < 1) {
      return NextResponse.json(
        { error: "lookBackDays must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof inventoryTurnoverDays !== 'number' || inventoryTurnoverDays < 1) {
      return NextResponse.json(
        { error: "inventoryTurnoverDays must be a positive number" },
        { status: 400 }
      );
    }

    const service = new BooksReorderLevelService();
    const result = await service.summarizeLineItemsIntoItems(
      lineItems, 
      maxQuantity, 
      lookBackDays, 
      inventoryTurnoverDays
    );

    return NextResponse.json(result);

  } catch (error) {
    Logger.error("Error in Step 3.2", error);
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
