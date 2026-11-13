import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    const port = process.env.PORT ?? 8080;
    await app.listen(port);
    console.log(`[OPC SmartOffice Backend] Đang chạy tại http://localhost:${port}/api/v1`);
}
await bootstrap();
//# sourceMappingURL=main.js.map