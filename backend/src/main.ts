import { NestFactory } from '@nestjs/core';
import 'dotenv/config';

import { AppModule } from './app.module';
import { initMySqlSchema } from './db/init-db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  });

  await initMySqlSchema();

  await app.listen(Number(process.env.PORT) || 4000);
}

bootstrap().catch((err) => {
  console.error('Error starting app:', err);
  process.exit(1);
});
