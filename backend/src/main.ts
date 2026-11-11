import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // 1. Enable CORS for web and mobile client
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 2. Set global prefix api/v1
  app.setGlobalPrefix('api/v1');

  // 3. Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 4. Standard Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`[OPC SmartOffice Backend] Đang chạy tại http://localhost:${port}/api/v1`);
}
await bootstrap();
