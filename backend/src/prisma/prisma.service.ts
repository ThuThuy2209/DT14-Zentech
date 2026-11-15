import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // khởi tạo prisma
    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  // Tự động kết nối DB khi Module khởi động
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Đã kết nối cơ sở dữ liệu PostgreSQL thành công!');
  }

  // Tự động ngắt kết nối an toàn, giải phóng RAM
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Đã ngắt kết nối cơ sở dữ liệu an toàn!');
  }
}
