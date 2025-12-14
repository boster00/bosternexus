import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Context } from './Context';
import { randomUUID } from 'crypto';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    const sessionId = (req.headers['x-session-id'] as string) || (req.cookies?.sessionId as string);
    const userId = req.headers['x-user-id'] as string | undefined;

    const context = {
      requestId,
      sessionId,
      userId,
      locale: req.headers['accept-language']?.split(',')[0] || 'en',
      attribution: {
        source: req.query.utm_source as string | undefined,
        medium: req.query.utm_medium as string | undefined,
        campaign: req.query.utm_campaign as string | undefined,
      },
      tracking: {},
    };

    Context.run(context, () => {
      next();
    });
  }
}

