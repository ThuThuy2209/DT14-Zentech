import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto.js';
import { UpdateSalesInvoiceDto } from './dto/update-sales-invoice.dto.js';
import { FilterSalesInvoiceDto } from './dto/filter-sales-invoice.dto.js';
import { CreateFromAcceptanceDto } from './dto/create-from-acceptance.dto.js';

@Injectable()
export class SalesInvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TỰ SINH SỐ HÓA ĐƠN BÁN RA: HD-YYYYMM-XXXX
   */
  private async generateInvoiceNumber(): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await this.prisma.salesInvoice.count({
      where: { invoiceNumber: { startsWith: `HD-${yearMonth}` } },
    });
    return `HD-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * LẬP HÓA ĐƠN BÁN RA MỚI (FR-65)
   */
  async create(dto: CreateSalesInvoiceDto, userId?: number) {
    // 1. Kiểm tra khách hàng
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Không tìm thấy khách hàng với ID #${dto.customerId}`);
    }

    // 2. Kiểm tra hợp đồng nếu có
    if (dto.contractId) {
      const contract = await this.prisma.contract.findUnique({
        where: { id: dto.contractId },
      });
      if (!contract) {
        throw new NotFoundException(`Không tìm thấy hợp đồng với ID #${dto.contractId}`);
      }
    }

    // 3. Kiểm tra nghiệm thu nếu có
    if (dto.acceptanceId) {
      const acceptance = await this.prisma.acceptanceRecord.findUnique({
        where: { id: dto.acceptanceId },
      });
      if (!acceptance) {
        throw new NotFoundException(`Không tìm thấy hồ sơ nghiệm thu với ID #${dto.acceptanceId}`);
      }
      if (acceptance.result !== 'PASSED') {
        throw new BadRequestException('Chỉ hồ sơ nghiệm thu đạt (PASSED) mới có thể xuất hóa đơn bán ra');
      }
    }

    // 4. Sinh số hóa đơn
    const invoiceNumber = dto.invoiceNumber?.trim() || (await this.generateInvoiceNumber());

    const existingNumber = await this.prisma.salesInvoice.findUnique({
      where: { invoiceNumber },
    });
    if (existingNumber) {
      throw new ConflictException(`Số hóa đơn ${invoiceNumber} đã tồn tại trong hệ thống`);
    }

    // 5. Tính toán tài chính (FR-68)
    const subtotal = Number(dto.subtotal);
    const taxAmount = dto.taxAmount !== undefined ? Number(dto.taxAmount) : Math.round(subtotal * 0.1);
    const totalAmount = dto.totalAmount !== undefined ? Number(dto.totalAmount) : subtotal + taxAmount;
    const outstandingAmount = totalAmount;

    const invoiceDate = dto.invoiceDate ? new Date(dto.invoiceDate) : new Date();
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // mặc định 30 ngày

    // 6. Lưu vào DB
    const invoice = await this.prisma.salesInvoice.create({
      data: {
        invoiceNumber,
        customerId: dto.customerId,
        contractId: dto.contractId || null,
        acceptanceId: dto.acceptanceId || null,
        invoiceDate,
        dueDate,
        subtotal,
        taxAmount,
        totalAmount,
        outstandingAmount,
        paidAmount: 0,
        invoiceStatus: 'DRAFT',
        paymentStatus: 'UNPAID',
        documentId: dto.documentId || null,
      },
      include: {
        customer: true,
        contract: {
          select: {
            id: true,
            contractCode: true,
            contractName: true,
          },
        },
        acceptanceRecord: {
          select: {
            id: true,
            acceptanceCode: true,
            result: true,
          },
        },
      },
    });

    // 7. Ghi nhật ký
    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'CREATE_SALES_INVOICE',
        entityType: 'SALES_INVOICE',
        entityId: invoice.id,
        description: `Lập hóa đơn bán ra ${invoice.invoiceNumber} cho khách hàng ${customer.customerName} - Giá trị: ${Number(invoice.totalAmount).toLocaleString('vi-VN')} VND`,
      },
    });

    return invoice;
  }

  /**
   * XUẤT HÓA ĐƠN TỰ ĐỘNG TỪ BIÊN BẢN NGHIỆM THU ĐẠT (FR-66, FR-67)
   */
  async createFromAcceptance(
    acceptanceId: number,
    dto: CreateFromAcceptanceDto,
    userId?: number,
  ) {
    const acceptance = await this.prisma.acceptanceRecord.findUnique({
      where: { id: acceptanceId },
      include: {
        contract: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!acceptance) {
      throw new NotFoundException(`Không tìm thấy hồ sơ nghiệm thu với ID #${acceptanceId}`);
    }

    if (acceptance.result !== 'PASSED') {
      throw new BadRequestException(
        `Hồ sơ nghiệm thu ${acceptance.acceptanceCode} có kết quả là ${acceptance.result}. Chỉ hồ sơ ĐẠT (PASSED) mới được xuất hóa đơn.`,
      );
    }

    // Giá trị hợp đồng làm tiền trước thuế
    const subtotal = Number(acceptance.contract.contractValue || 0);
    const taxRate = dto.taxRate ?? 10;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const totalAmount = subtotal + taxAmount;
    const outstandingAmount = totalAmount;

    const invoiceNumber = await this.generateInvoiceNumber();
    const invoiceDate = new Date();
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const invoice = await this.prisma.salesInvoice.create({
      data: {
        invoiceNumber,
        customerId: acceptance.contract.customerId,
        contractId: acceptance.contractId,
        acceptanceId,
        invoiceDate,
        dueDate,
        subtotal,
        taxAmount,
        totalAmount,
        outstandingAmount,
        paidAmount: 0,
        invoiceStatus: 'DRAFT',
        paymentStatus: 'UNPAID',
      },
      include: {
        customer: true,
        contract: {
          select: {
            id: true,
            contractCode: true,
            contractName: true,
          },
        },
        acceptanceRecord: {
          select: {
            id: true,
            acceptanceCode: true,
            result: true,
          },
        },
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'CREATE_SALES_INVOICE_FROM_ACCEPTANCE',
        entityType: 'SALES_INVOICE',
        entityId: invoice.id,
        description: `Xuất hóa đơn ${invoice.invoiceNumber} từ hồ sơ nghiệm thu ${acceptance.acceptanceCode} - Tổng tiền: ${Number(invoice.totalAmount).toLocaleString('vi-VN')} VND`,
      },
    });

    return invoice;
  }

  /**
   * TRA CỨU & DANH SÁCH HÓA ĐƠN BÁN RA (FR-70)
   */
  async findAll(query: FilterSalesInvoiceDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.customerId) {
      where.customerId = Number(query.customerId);
    }
    if (query.contractId) {
      where.contractId = Number(query.contractId);
    }
    if (query.acceptanceId) {
      where.acceptanceId = Number(query.acceptanceId);
    }
    if (query.invoiceStatus) {
      where.invoiceStatus = query.invoiceStatus;
    }
    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }

    if (query.search) {
      const kw = query.search.trim();
      where.OR = [
        { invoiceNumber: { contains: kw, mode: 'insensitive' } },
        { customer: { customerName: { contains: kw, mode: 'insensitive' } } },
        { customer: { contactPerson: { contains: kw, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.salesInvoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              customerName: true,
              contactPerson: true,
              taxCode: true,
              email: true,
              phone: true,
            },
          },
          contract: {
            select: {
              id: true,
              contractCode: true,
              contractName: true,
            },
          },
          acceptanceRecord: {
            select: {
              id: true,
              acceptanceCode: true,
              result: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              paymentDate: true,
              paymentMethod: true,
              paymentStatus: true,
            },
          },
        },
      }),
      this.prisma.salesInvoice.count({ where }),
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
   * XEM CHI TIẾT 1 HÓA ĐƠN BÁN RA (FR-70, FR-71)
   */
  async findOne(id: number) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id },
      include: {
        customer: true,
        contract: true,
        acceptanceRecord: true,
        document: true,
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn bán ra với ID #${id}`);
    }

    return invoice;
  }

  /**
   * CẬP NHẬT THÔNG TIN HÓA ĐƠN BÁN RA (KHI CÒN LÀ DRAFT)
   */
  async update(id: number, dto: UpdateSalesInvoiceDto, userId?: number) {
    const invoice = await this.findOne(id);

    if (invoice.invoiceStatus !== 'DRAFT') {
      throw new BadRequestException('Chỉ có thể chỉnh sửa hóa đơn khi còn ở trạng thái Nháp (DRAFT)');
    }

    const numSubtotal = dto.subtotal !== undefined ? Number(dto.subtotal) : Number(invoice.subtotal);
    const numTaxAmount =
      dto.taxAmount !== undefined
        ? Number(dto.taxAmount)
        : dto.subtotal !== undefined
          ? Math.round(numSubtotal * 0.1)
          : Number(invoice.taxAmount);
    const numTotal = dto.totalAmount !== undefined ? Number(dto.totalAmount) : numSubtotal + numTaxAmount;

    const updated = await this.prisma.salesInvoice.update({
      where: { id },
      data: {
        invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        subtotal: numSubtotal,
        taxAmount: numTaxAmount,
        totalAmount: numTotal,
        outstandingAmount: numTotal - Number(invoice.paidAmount),
        documentId: dto.documentId !== undefined ? dto.documentId : undefined,
      },
      include: {
        customer: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'UPDATE_SALES_INVOICE',
        entityType: 'SALES_INVOICE',
        entityId: id,
        description: `Cập nhật hóa đơn bán ra ${invoice.invoiceNumber}`,
      },
    });

    return updated;
  }

  /**
   * PHÁT HÀNH HÓA ĐƠN (DRAFT -> ISSUED) (FR-69)
   */
  async issue(id: number, userId?: number) {
    const invoice = await this.findOne(id);

    if (invoice.invoiceStatus === 'ISSUED') {
      throw new BadRequestException('Hóa đơn này đã được phát hành trước đó');
    }
    if (invoice.invoiceStatus === 'CANCELLED') {
      throw new BadRequestException('Không thể phát hành hóa đơn đã bị hủy');
    }

    const updated = await this.prisma.salesInvoice.update({
      where: { id },
      data: {
        invoiceStatus: 'ISSUED',
        issueDate: new Date(),
      },
      include: {
        customer: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'ISSUE_SALES_INVOICE',
        entityType: 'SALES_INVOICE',
        entityId: id,
        description: `Phát hành chính thức hóa đơn bán ra ${invoice.invoiceNumber}`,
      },
    });

    return updated;
  }

  /**
   * HỦY HÓA ĐƠN BÁN RA (FR-69)
   */
  async cancel(id: number, reason?: string, userId?: number) {
    const invoice = await this.findOne(id);

    if (Number(invoice.paidAmount) > 0) {
      throw new BadRequestException('Không thể hủy hóa đơn đã có khoản thanh toán');
    }
    if (invoice.invoiceStatus === 'CANCELLED') {
      throw new BadRequestException('Hóa đơn này đã bị hủy trước đó');
    }

    const updated = await this.prisma.salesInvoice.update({
      where: { id },
      data: {
        invoiceStatus: 'CANCELLED',
      },
      include: {
        customer: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'CANCEL_SALES_INVOICE',
        entityType: 'SALES_INVOICE',
        entityId: id,
        description: `Hủy hóa đơn bán ra ${invoice.invoiceNumber}${reason ? ` (Lý do: ${reason})` : ''}`,
      },
    });

    return updated;
  }
}
