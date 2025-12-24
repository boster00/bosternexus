import { NextResponse } from 'next/server';
import { getAllBicTags } from '@/libs/db/bic';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bic/tags
 * Returns all unique tags
 */
export async function GET() {
  try {
    const tags = await getAllBicTags();
    return NextResponse.json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error('Error getting tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get tags' },
      { status: 500 }
    );
  }
}

