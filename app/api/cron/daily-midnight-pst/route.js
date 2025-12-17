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
    // Vercel sends cron jobs with the 'x-vercel-cron' header
    const cronHeader = request.headers.get('x-vercel-cron');
    const cronSecret = process.env.CRON_SECRET;
    
    // In production, Vercel automatically adds the x-vercel-cron header
    // For local testing or additional security, you can also check CRON_SECRET
    if (process.env.NODE_ENV === 'production' && !cronHeader) {
      Logger.warn('Cron job called without Vercel header', {
        path: '/api/cron/daily-midnight-pst',
        headers: Object.fromEntries(request.headers.entries())
      });
      // In production, reject if no Vercel header (unless CRON_SECRET is provided as fallback)
      if (!cronSecret) {
        return NextResponse.json(
          { error: 'Unauthorized - not a Vercel cron request' },
          { status: 401 }
        );
      }
    }
    
    // Optional: Additional security with CRON_SECRET for manual triggers
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
        Logger.warn('Unauthorized cron job attempt with invalid secret', {
          path: '/api/cron/daily-midnight-pst'
        });
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
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
