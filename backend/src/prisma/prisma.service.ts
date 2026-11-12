import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres123@localhost:5433/opc_smartoffice?schema=public';

    // 1. Tạo Pool kết nối PostgreSQL
    const pool = new Pool({
      connectionString,
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

  // Tự động kết nối DB & nạp tài khoản mẫu nếu trống
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Đã kết nối cơ sở dữ liệu PostgreSQL thành công!');
    await this.seedInitialDataIfEmpty();
  }

  // Tự động ngắt kết nối an toàn, giải phóng RAM
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Đã ngắt kết nối cơ sở dữ liệu an toàn!');
  }

  /**
   * Tự động khởi tạo tài khoản Chủ doanh nghiệp và thông tin Công ty mặc định
   * nếu cơ sở dữ liệu đang trống.
   */
  private async seedInitialDataIfEmpty() {
    try {
      const userCount = await this.user.count();
      if (userCount === 0) {
        this.logger.log('Database trống, đang tự động khởi tạo tài khoản Chủ doanh nghiệp mặc định...');

        const passwordHash = await bcrypt.hash('Admin@123', 10);
        await this.user.create({
          data: {
            username: 'admin',
            passwordHash,
            email: 'minh.software@example.com',
            fullName: 'Nguyễn Văn Minh',
            status: 'ACTIVE',
          },
        });

        await this.company.create({
          data: {
            companyName: 'Công ty TNHH Một thành viên Minh Software',
            taxCode: '0312345678',
            address: 'Tầng 5, Tòa nhà TechHub, Quận 1, TP. Hồ Chí Minh',
            email: 'contact@minhsoftware.com',
            phone: '0901234567',
            representative: 'Nguyễn Văn Minh',
          },
        });

        await this.service.createMany({
          data: [
            {
              serviceName: 'Tư vấn & Thiết kế giải pháp phần mềm',
              description: 'Khảo sát yêu cầu, thiết kế kiến trúc hệ thống và cơ sở dữ liệu',
              unit: 'Gói',
              unitPrice: 15000000,
              status: 'ACTIVE',
            },
            {
              serviceName: 'Lập trình ứng dụng Web & Mobile',
              description: 'Phát triển giao diện và API theo chức năng đã duyệt',
              unit: 'Tính năng',
              unitPrice: 25000000,
              status: 'ACTIVE',
            },
            {
              serviceName: 'Bảo trì & Vận hành hệ thống',
              description: 'Theo dõi máy chủ, sao lưu dữ liệu và hỗ trợ kỹ thuật',
              unit: 'Tháng',
              unitPrice: 5000000,
              status: 'ACTIVE',
            },
          ],
        });

        this.logger.log('✅ Khởi tạo tài khoản mẫu thành công: username="admin", password="Admin@123"');
      }
    } catch (error: any) {
      this.logger.warn(`Không thể tự động seed dữ liệu: ${error.message}`);
    }
  }
}
