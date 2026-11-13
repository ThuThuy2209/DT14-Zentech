import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { FilterServiceDto } from './dto/filter-service.dto.js';
import { UpdateServicePriceDto } from './dto/update-service-price.dto.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. THÊM DỊCH VỤ MỚI
   */
  async create(createServiceDto: CreateServiceDto) {
    const normalizedName = createServiceDto.serviceName.trim();

    const existing = await this.prisma.service.findFirst({
      where: {
        serviceName: { equals: normalizedName, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Dịch vụ "${normalizedName}" đã tồn tại trong danh mục!`,
      );
    }

    return this.prisma.service.create({
      data: {
        serviceName: normalizedName,
        description: createServiceDto.description?.trim() || null,
        unit: createServiceDto.unit?.trim() || 'Gói',
        unitPrice: createServiceDto.unitPrice,
        status: createServiceDto.status ?? 'ACTIVE',
      },
    });
  }

  /**
   * 2. XEM DANH SÁCH & TÌM KIẾM DỊCH VỤ
   */
  async findAll(query: FilterServiceDto) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const keyword = query.search.trim();
      where.OR = [
        { serviceName: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { unit: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          _count: {
            select: { quotationItems: true },
          },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 3. XEM CHI TIẾT 1 DỊCH VỤ THEO ID
   */
  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { quotationItems: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Không tìm thấy dịch vụ với ID #${id}`);
    }

    return service;
  }

  /**
   * 4. CẬP NHẬT THÔNG TIN DỊCH VỤ
   */
  async update(id: number, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);

    if (updateServiceDto.serviceName) {
      const normalizedName = updateServiceDto.serviceName.trim();
      const existing = await this.prisma.service.findFirst({
        where: {
          serviceName: { equals: normalizedName, mode: 'insensitive' },
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Tên dịch vụ "${normalizedName}" đã bị trùng với dịch vụ khác!`,
        );
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(updateServiceDto.serviceName && {
          serviceName: updateServiceDto.serviceName.trim(),
        }),
        ...(updateServiceDto.description !== undefined && {
          description: updateServiceDto.description?.trim() || null,
        }),
        ...(updateServiceDto.unit !== undefined && {
          unit: updateServiceDto.unit?.trim() || 'Gói',
        }),
        ...(updateServiceDto.unitPrice !== undefined && {
          unitPrice: updateServiceDto.unitPrice,
        }),
        ...(updateServiceDto.status && { status: updateServiceDto.status }),
      },
    });
  }

  /**
   * 5. CẬP NHẬT ĐƠN GIÁ DỊCH VỤ
   */
  async updatePrice(id: number, updatePriceDto: UpdateServicePriceDto) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: { unitPrice: updatePriceDto.unitPrice },
    });
  }

  /**
   * 6. NGỪNG KINH DOANH HOẶC KÍCH HOẠT LẠI DỊCH VỤ
   */
  async toggleStatus(id: number, targetStatus?: string) {
    const service = await this.findOne(id);
    const newStatus =
      targetStatus || (service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');

    return this.prisma.service.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  /**
   * 7. XÓA DỊCH VỤ (Tự động xóa mềm nếu đã từng dùng trong báo giá)
   */
  async remove(id: number) {
    const service = await this.findOne(id);

    if (service._count.quotationItems > 0) {
      // Đã có trong báo giá: Chuyển sang INACTIVE
      await this.prisma.service.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

      return {
        isSoftDeleted: true,
        message: `Dịch vụ "${service.serviceName}" đã được dùng trong Báo giá, hệ thống đã chuyển sang Ngừng kinh doanh (INACTIVE) để bảo toàn dữ liệu.`,
      };
    }

    // Chưa từng dùng: Xóa hoàn toàn
    await this.prisma.service.delete({ where: { id } });

    return {
      isSoftDeleted: false,
      message: `Đã xóa dịch vụ "${service.serviceName}" khỏi danh mục thành công.`,
    };
  }
}
