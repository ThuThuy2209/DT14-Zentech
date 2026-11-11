import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Tạo Pool kết nối PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Adapter cho Prisma 7
    const adapter = new PrismaPg(pool);

    // 3. Khởi tạo PrismaClient kèm cấu hình LOG câu lệnh SQL
    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  // Tự động kết nối DB
  async onModuleInit() {
    await this.$connect();
    console.log(
      '[PrismaService] Đã kết nối cơ sở dữ liệu PostgreSQL thành công!',
    );
  }

  // Tự động ngắt kết nối an toàn, giải phóng RAM
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[PrismaService] Đã ngắt kết nối cơ sở dữ liệu an toàn!');
  }
}
