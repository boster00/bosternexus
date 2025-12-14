import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'zod-validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // Global strict validation with Zod
  app.useGlobalPipes(
    new ZodValidationPipe({
      errorHttpStatusCode: 400,
      transform: true,
      disableErrorMessages: false,
    })
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API server running on http://localhost:${port}`);
}

bootstrap();

