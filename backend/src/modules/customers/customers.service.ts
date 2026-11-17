import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { FilterCustomerDto } from './dto/filter-customer.dto.js';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo mới một khách hàng
   */
  async create(createCustomerDto: CreateCustomerDto) {
    // 1. Kiểm tra mã số thuế trùng lặp nếu có nhập
    if (createCustomerDto.taxCode) {
      const normalizedTaxCode = createCustomerDto.taxCode.trim();
      const existing = await this.prisma.customer.findFirst({
        where: { taxCode: normalizedTaxCode },
      });

      if (existing) {
        throw new ConflictException(
          `Mã số thuế "${normalizedTaxCode}" đã tồn tại cho khách hàng "${existing.customerName}"!`,
        );
      }
    }

    // 2. Tạo bản ghi khách hàng
    return this.prisma.customer.create({
      data: {
        customerName: createCustomerDto.customerName.trim(),
        taxCode: createCustomerDto.taxCode?.trim() || null,
        address: createCustomerDto.address?.trim() || null,
        email: createCustomerDto.email?.trim() || null,
        phone: createCustomerDto.phone?.trim() || null,
        contactPerson: createCustomerDto.contactPerson?.trim() || null,
        status: createCustomerDto.status ?? 'ACTIVE',
      },
    });
  }

  /**
   * Lấy danh sách khách hàng có phân trang và tìm kiếm
   */
  async findAll(query: FilterCustomerDto) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Lọc theo trạng thái hoạt động
    if (query.status) {
      where.status = query.status;
    }

    // Tìm kiếm đa năng (tên, MST, SĐT, email, người liên hệ)
    if (query.search && query.search.trim()) {
      const keyword = query.search.trim();
      where.OR = [
        { customerName: { contains: keyword, mode: 'insensitive' } },
        { taxCode: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { contactPerson: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Truy vấn dữ liệu và đếm tổng số
    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              quotations: true,
              contracts: true,
              salesInvoices: true,
            },
          },
        },
      }),
      this.prisma.customer.count({ where }),
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
   * Xem chi tiết thông tin một khách hàng
   */
  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            quotations: true,
            contracts: true,
            salesInvoices: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Không tìm thấy khách hàng với ID #${id}`);
    }

    return customer;
  }

  /**
   * Cập nhật thông tin khách hàng
   */
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    // 1. Kiểm tra tồn tại
    await this.findOne(id);

    // 2. Nếu có đổi mã số thuế, kiểm tra không bị trùng với khách hàng khác
    if (updateCustomerDto.taxCode) {
      const normalizedTaxCode = updateCustomerDto.taxCode.trim();
      const existing = await this.prisma.customer.findFirst({
        where: {
          taxCode: normalizedTaxCode,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Mã số thuế "${normalizedTaxCode}" đã thuộc về khách hàng "${existing.customerName}"!`,
        );
      }
    }

    // 3. Tiến hành cập nhật
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...(updateCustomerDto.customerName && {
          customerName: updateCustomerDto.customerName.trim(),
        }),
        ...(updateCustomerDto.taxCode !== undefined && {
          taxCode: updateCustomerDto.taxCode?.trim() || null,
        }),
        ...(updateCustomerDto.address !== undefined && {
          address: updateCustomerDto.address?.trim() || null,
        }),
        ...(updateCustomerDto.email !== undefined && {
          email: updateCustomerDto.email?.trim() || null,
        }),
        ...(updateCustomerDto.phone !== undefined && {
          phone: updateCustomerDto.phone?.trim() || null,
        }),
        ...(updateCustomerDto.contactPerson !== undefined && {
          contactPerson: updateCustomerDto.contactPerson?.trim() || null,
        }),
        ...(updateCustomerDto.status && { status: updateCustomerDto.status }),
      },
    });
  }

  /**
   * Xóa khách hàng (Tự động xóa mềm nếu đã có dữ liệu giao dịch phát sinh)
   */
  async remove(id: number) {
    const customer = await this.findOne(id);

    // Kiểm tra xem khách hàng đã phát sinh báo giá, hợp đồng hoặc hóa đơn chưa
    const hasTransactions =
      customer._count.quotations > 0 ||
      customer._count.contracts > 0 ||
      customer._count.salesInvoices > 0;

    if (hasTransactions) {
      // Xóa mềm: Chuyển trạng thái sang INACTIVE để bảo toàn chứng từ kế toán
      await this.prisma.customer.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

      return {
        isSoftDeleted: true,
        message:
          'Khách hàng đã phát sinh giao dịch (báo giá/hợp đồng/hóa đơn), hệ thống đã chuyển trạng thái sang ngưng hoạt động (INACTIVE) để bảo toàn dữ liệu.',
      };
    }

    // Xóa cứng nếu chưa từng có giao dịch phát sinh
    await this.prisma.customer.delete({ where: { id } });

    return {
      isSoftDeleted: false,
      message: `Đã xóa hoàn toàn khách hàng "${customer.customerName}" khỏi hệ thống.`,
    };
  }
}
