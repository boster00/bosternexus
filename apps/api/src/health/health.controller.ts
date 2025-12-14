import { Controller, Get } from '@nestjs/common';
import { HealthResponse } from '@bosternexus/shared';
import { Context } from '../context/Context';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    const ctx = Context.current();
    
    return {
      ok: true,
      version: process.env.APP_VERSION || '1.0.0',
      requestId: ctx.requestId,
      timestamp: new Date().toISOString(),
    };
  }
}

