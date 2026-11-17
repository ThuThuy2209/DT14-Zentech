import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';

// Fix serialization lỗi: "Do not know how to serialize a BigInt" cho toàn ứng dụng
(BigInt.prototype as any).toJSON = function () {
  const intVal = Number(this);
  return Number.isSafeInteger(intVal) ? intVal : this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
  });

  // 1. Enable CORS for web and mobile client
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 2. Phục vụ tệp tĩnh (PDF, ảnh hóa đơn) cho Frontend xem trực tiếp
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // 3. Set global prefix api/v1
  app.setGlobalPrefix('api/v1');

  // 4. Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 5. Standard Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`[OPC SmartOffice Backend] Đang chạy tại http://localhost:${port}/api/v1`);
}
await bootstrap();
