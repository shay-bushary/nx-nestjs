/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const { port, host, envName } = environment;
  await app.listen(port, host);
  Logger.log(`[${envName}] Application is running on: http://${host}:${port}/${globalPrefix}`);
}

bootstrap();
