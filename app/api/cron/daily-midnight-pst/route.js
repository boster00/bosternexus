/**
 * Daily Midnight PST Cron Job
 * 
 * Runs daily at midnight Pacific Standard Time (8 AM UTC).
 * 
 * This cron job is configured in vercel.json and will be triggered automatically by Vercel.
 * 
 * Current schedule: 0 8 * * * (8 AM UTC = midnight PST)
 * 
 * Note: During daylight saving time (PDT), this runs at 1 AM PDT (7 AM UTC).
 * To adjust for year-round midnight PST/PDT, consider using 7 AM UTC or a timezone-aware solution.
 */

import { NextResponse } from 'next/server';
import { Logger } from '@/libs/utils/logger';

/**
 * GET handler for Vercel cron job
 * Vercel cron jobs send GET requests to the configured path
 * 
 * @param {Request} request - The incoming request
 * @returns {Promise<NextResponse>} Response indicating success or failure
 */
export async function GET(request) {
  try {
    // Verify this is a legitimate Vercel cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      Logger.warn('Unauthorized cron job attempt', {
        authHeader: authHeader ? 'present' : 'missing',
        path: '/api/cron/daily-midnight-pst'
      });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    Logger.info('Daily midnight PST cron job started', {
      timestamp: new Date().toISOString(),
      timezone: 'PST/PDT'
    });

    // TODO: Add scheduled tasks here
    // Examples:
    // - Daily Zoho data sync
    // - Cleanup old records
    // - Generate daily reports
    // - Send scheduled notifications

    Logger.info('Daily midnight PST cron job completed', {
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Daily midnight PST cron job executed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    Logger.error('Daily midnight PST cron job failed', error, {
      path: '/api/cron/daily-midnight-pst',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Cron job execution failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
