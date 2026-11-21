import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';

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

  // 6.config authentication globally
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 7. Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('OPC SmartOffice API')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  });

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(
    `[OPC SmartOffice Backend] Đang chạy tại http://localhost:${port}/api/v1`,
  );
  console.log(`[Swagger UI] Sẵn sàng tại http://localhost:${port}/api/docs`);
}
await bootstrap();
