import { NextResponse } from 'next/server';
import { buildBicSearchIndex } from '@/libs/db/bic';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bic/search-index
 * Returns the search index for client-side search
 */
export async function GET() {
  try {
    const index = await buildBicSearchIndex();
    return NextResponse.json({
      success: true,
      index,
    });
  } catch (error) {
    console.error('Error building search index:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to build search index' },
      { status: 500 }
    );
  }
}

