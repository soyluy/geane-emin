/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './Root/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  // Enable cookie parser middleware
  // TODO: Use a more secure cookie parser in production
  // e.g., with options like `secure: true` for HTTPS, `httpOnly: true`, etc.
  app.use(cookieParser());
  
  // Add validation pipe with transformer
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
