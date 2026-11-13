import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { FilterQuoteDto } from './dto/filter-quote.dto.js';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto.js';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * FR-29: LẤY DANH MỤC DỊCH VỤ MẪU ĐỂ CHỌN KHI LẬP BÁO GIÁ
   */
  async getServices() {
    return this.prisma.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * FR-28, FR-30, FR-31 & BR-06, BR-07: TẠO MỚI BÁO GIÁ KÈM CHI TIẾT VÀ TÍNH TỔNG TIỀN
   */
  async create(createQuoteDto: CreateQuoteDto, userId?: number) {
    // a. Kiểm tra khách hàng tồn tại
    const customer = await this.prisma.customer.findUnique({
      where: { id: createQuoteDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Không tìm thấy khách hàng với ID #${createQuoteDto.customerId}`,
      );
    }

    // b. Tự động sinh mã báo giá nếu chưa nhập (dạng: BG-YYYYMM-XXXX)
    let quotationCode = createQuoteDto.quotationCode?.trim();
    if (!quotationCode) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const countThisMonth = await this.prisma.quotation.count({
        where: {
          quotationCode: { startsWith: `BG-${yearMonth}` },
        },
      });
      quotationCode = `BG-${yearMonth}-${String(countThisMonth + 1).padStart(4, '0')}`;
    } else {
      const existing = await this.prisma.quotation.findUnique({
        where: { quotationCode },
      });
      if (existing) {
        throw new ConflictException(
          `Mã báo giá "${quotationCode}" đã tồn tại trên hệ thống!`,
        );
      }
    }

    // c. FR-31 & BR-07: Tính toán tài chính
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    const itemsData = createQuoteDto.items.map((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const discountAmount = Number(item.discountAmount ?? 0);
      const taxRate = Number(item.taxRate ?? 10);

      const lineSubtotal = quantity * unitPrice;
      const lineAfterDiscount = Math.max(0, lineSubtotal - discountAmount);
      const lineTax = (lineAfterDiscount * taxRate) / 100;
      const lineTotal = lineAfterDiscount + lineTax;

      subtotal += lineSubtotal;
      totalDiscount += discountAmount;
      totalTax += lineTax;

      return {
        serviceId: item.serviceId || null,
        description: item.description.trim(),
        quantity,
        unitPrice,
        discountAmount,
        taxRate,
        lineTotal: Math.round(lineTotal * 100) / 100,
      };
    });

    const totalAmount = subtotal - totalDiscount + totalTax;

    // d. Lưu Database trong Transaction và ghi FR-37: Lịch sử hoạt động
    return this.prisma.$transaction(async (tx) => {
      const quote = await tx.quotation.create({
        data: {
          quotationCode,
          customerId: createQuoteDto.customerId,
          createdDate: createQuoteDto.createdDate
            ? new Date(createQuoteDto.createdDate)
            : new Date(),
          validUntil: createQuoteDto.validUntil
            ? new Date(createQuoteDto.validUntil)
            : null,
          subtotal: Math.round(subtotal * 100) / 100,
          discountAmount: Math.round(totalDiscount * 100) / 100,
          taxAmount: Math.round(totalTax * 100) / 100,
          totalAmount: Math.round(totalAmount * 100) / 100,
          status: createQuoteDto.status ?? 'DRAFT',
          note: createQuoteDto.note?.trim() || null,
          items: {
            create: itemsData,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              customerName: true,
              taxCode: true,
              phone: true,
              email: true,
            },
          },
          items: {
            include: {
              service: true,
            },
          },
        },
      });

      // FR-37: Ghi nhật ký tạo báo giá
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: 'CREATE_QUOTATION',
          entityType: 'QUOTATION',
          entityId: quote.id,
          description: `Tạo mới báo giá ${quote.quotationCode} cho khách hàng ${customer.customerName} với tổng tiền ${Number(quote.totalAmount).toLocaleString('vi-VN')} đ`,
        },
      });

      return quote;
    });
  }

  /**
   * LẤY DANH SÁCH BÁO GIÁ CÓ PHÂN TRANG & TÌM KIẾM
   */
  async findAll(query: FilterQuoteDto) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.customerId) {
      where.customerId = Number(query.customerId);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const keyword = query.search.trim();
      where.OR = [
        { quotationCode: { contains: keyword, mode: 'insensitive' } },
        { customer: { customerName: { contains: keyword, mode: 'insensitive' } } },
        { note: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.quotation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              customerName: true,
              phone: true,
              email: true,
            },
          },
          contract: {
            select: {
              id: true,
              contractCode: true,
              status: true,
            },
          },
          _count: {
            select: { items: true },
          },
        },
      }),
      this.prisma.quotation.count({ where }),
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
   * FR-33: XEM CHI TIẾT 1 BÁO GIÁ KÈM TOÀN BỘ HẠNG MỤC
   */
  async findOne(id: number) {
    const quote = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            service: true,
          },
          orderBy: { id: 'asc' },
        },
        contract: {
          select: {
            id: true,
            contractCode: true,
            contractName: true,
            status: true,
          },
        },
      },
    });

    if (!quote) {
      throw new NotFoundException(`Không tìm thấy báo giá với ID #${id}`);
    }

    return quote;
  }

  /**
   * FR-32: CẬP NHẬT THÔNG TIN BÁO GIÁ (KHI CHƯA Ở TRẠNG THÁI KHÓA)
   */
  async update(id: number, updateQuoteDto: UpdateQuoteDto, userId?: number) {
    const quote = await this.findOne(id);

    // Không cho chỉnh sửa khi báo giá đã duyệt và đã tạo Hợp đồng
    if (quote.status === 'ACCEPTED' && quote.contract) {
      throw new BadRequestException(
        `Báo giá đã được phê duyệt và tạo Hợp đồng (${quote.contract.contractCode}), không thể chỉnh sửa!`,
      );
    }

    if (updateQuoteDto.customerId && updateQuoteDto.customerId !== quote.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: updateQuoteDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException(
          `Không tìm thấy khách hàng với ID #${updateQuoteDto.customerId}`,
        );
      }
    }

    // Nếu cập nhật danh sách items thì tính lại toàn bộ tài chính
    if (updateQuoteDto.items && updateQuoteDto.items.length > 0) {
      let subtotal = 0;
      let totalDiscount = 0;
      let totalTax = 0;

      const itemsData = updateQuoteDto.items.map((item) => {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        const discountAmount = Number(item.discountAmount ?? 0);
        const taxRate = Number(item.taxRate ?? 10);

        const lineSubtotal = quantity * unitPrice;
        const lineAfterDiscount = Math.max(0, lineSubtotal - discountAmount);
        const lineTax = (lineAfterDiscount * taxRate) / 100;
        const lineTotal = lineAfterDiscount + lineTax;

        subtotal += lineSubtotal;
        totalDiscount += discountAmount;
        totalTax += lineTax;

        return {
          serviceId: item.serviceId || null,
          description: item.description.trim(),
          quantity,
          unitPrice,
          discountAmount,
          taxRate,
          lineTotal: Math.round(lineTotal * 100) / 100,
        };
      });

      const totalAmount = subtotal - totalDiscount + totalTax;

      return this.prisma.$transaction(async (tx) => {
        await tx.quotationItem.deleteMany({
          where: { quotationId: id },
        });

        const updated = await tx.quotation.update({
          where: { id },
          data: {
            ...(updateQuoteDto.customerId && { customerId: updateQuoteDto.customerId }),
            ...(updateQuoteDto.createdDate && {
              createdDate: new Date(updateQuoteDto.createdDate),
            }),
            ...(updateQuoteDto.validUntil !== undefined && {
              validUntil: updateQuoteDto.validUntil
                ? new Date(updateQuoteDto.validUntil)
                : null,
            }),
            ...(updateQuoteDto.note !== undefined && {
              note: updateQuoteDto.note?.trim() || null,
            }),
            ...(updateQuoteDto.status && { status: updateQuoteDto.status }),
            subtotal: Math.round(subtotal * 100) / 100,
            discountAmount: Math.round(totalDiscount * 100) / 100,
            taxAmount: Math.round(totalTax * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100,
            items: {
              create: itemsData,
            },
          },
          include: {
            customer: true,
            items: {
              include: { service: true },
            },
          },
        });

        // FR-37: Lưu nhật ký chỉnh sửa
        await tx.activityLog.create({
          data: {
            userId: userId || null,
            action: 'UPDATE_QUOTATION',
            entityType: 'QUOTATION',
            entityId: id,
            description: `Cập nhật nội dung & hạng mục báo giá ${updated.quotationCode}`,
          },
        });

        return updated;
      });
    }

    // Cập nhật thông tin chung nếu không đổi items
    const updated = await this.prisma.quotation.update({
      where: { id },
      data: {
        ...(updateQuoteDto.customerId && { customerId: updateQuoteDto.customerId }),
        ...(updateQuoteDto.createdDate && {
          createdDate: new Date(updateQuoteDto.createdDate),
        }),
        ...(updateQuoteDto.validUntil !== undefined && {
          validUntil: updateQuoteDto.validUntil
            ? new Date(updateQuoteDto.validUntil)
            : null,
        }),
        ...(updateQuoteDto.note !== undefined && {
          note: updateQuoteDto.note?.trim() || null,
        }),
        ...(updateQuoteDto.status && { status: updateQuoteDto.status }),
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // FR-37: Lưu nhật ký chỉnh sửa
    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'UPDATE_QUOTATION',
        entityType: 'QUOTATION',
        entityId: id,
        description: `Cập nhật thông tin chung báo giá ${updated.quotationCode}`,
      },
    });

    return updated;
  }

  /**
   * FR-35: THEO DÕI & CẬP NHẬT TRẠNG THÁI BÁO GIÁ
   */
  async updateStatus(id: number, dto: UpdateQuoteStatusDto, userId?: number) {
    const quote = await this.findOne(id);

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: { status: dto.status },
      include: {
        customer: true,
        items: true,
      },
    });

    // FR-37: Lưu lịch sử thay đổi trạng thái
    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'CHANGE_QUOTATION_STATUS',
        entityType: 'QUOTATION',
        entityId: id,
        description: `Chuyển trạng thái báo giá ${quote.quotationCode} từ ${quote.status} sang ${dto.status}`,
      },
    });

    return updated;
  }

  /**
   * FR-34: GỬI BÁO GIÁ CHO KHÁCH HÀNG QUA EMAIL
   */
  async sendQuote(id: number, userId?: number) {
    const quote = await this.findOne(id);

    if (!quote.customer.email) {
      throw new BadRequestException(
        `Khách hàng "${quote.customer.customerName}" chưa có địa chỉ email, vui lòng bổ sung email trước khi gửi!`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Chuyển trạng thái sang SENT nếu đang là DRAFT
      let updatedStatus = quote.status;
      if (quote.status === 'DRAFT') {
        updatedStatus = 'SENT';
        await tx.quotation.update({
          where: { id },
          data: { status: 'SENT' },
        });
      }

      // Ghi nhận vào email_logs
      const emailContent = `Kính gửi ${quote.customer.contactPerson || quote.customer.customerName},\n\nCông ty TNHH Một thành viên Minh Software trân trọng gửi đến Quý khách bảng báo giá dịch vụ số ${quote.quotationCode}.\nTổng giá trị thanh toán: ${Number(quote.totalAmount).toLocaleString('vi-VN')} VNĐ.\nThời hạn hiệu lực: ${quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('vi-VN') : 'Không giới hạn'}.\n\nTrân trọng!`;

      await tx.emailLog.create({
        data: {
          recipient: quote.customer.email as string,
          subject: `[Minh Software] Báo giá dịch vụ ${quote.quotationCode}`,
          content: emailContent,
          sentAt: new Date(),
          sendStatus: 'SENT',
        },
      });

      // FR-37: Lưu nhật ký gửi email
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: 'SEND_QUOTATION_EMAIL',
          entityType: 'QUOTATION',
          entityId: id,
          description: `Đã gửi email báo giá ${quote.quotationCode} đến ${quote.customer.email}`,
        },
      });

      return {
        quotationCode: quote.quotationCode,
        recipient: quote.customer.email,
        status: updatedStatus,
        sentAt: new Date(),
      };
    });
  }

  /**
   * FR-36 & BR-08, BR-09: CHUYỂN BÁO GIÁ THÀNH HỢP ĐỒNG
   */
  async convertToContract(id: number, userId?: number) {
    const quote = await this.findOne(id);

    // BR-08: Báo giá chỉ được chuyển thành hợp đồng khi có trạng thái ACCEPTED
    if (quote.status !== 'ACCEPTED') {
      throw new BadRequestException(
        `Theo quy tắc BR-08: Báo giá chỉ được chuyển thành hợp đồng khi ở trạng thái "ACCEPTED" (Khách hàng chấp nhận)! Trạng thái hiện tại: "${quote.status}".`,
      );
    }

    // BR-09: Mỗi báo giá chỉ được chuyển thành 1 hợp đồng
    if (quote.contract) {
      throw new ConflictException(
        `Theo quy tắc BR-09: Báo giá ${quote.quotationCode} đã được chuyển thành Hợp đồng "${quote.contract.contractCode}" trước đó!`,
      );
    }

    // Tự sinh mã hợp đồng chuẩn: HD-YYYYMM-XXXX
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const contractCount = await this.prisma.contract.count({
      where: { contractCode: { startsWith: `HD-${yearMonth}` } },
    });
    const contractCode = `HD-${yearMonth}-${String(contractCount + 1).padStart(4, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      // Tạo bản ghi hợp đồng
      const contract = await tx.contract.create({
        data: {
          contractCode,
          quotationId: quote.id,
          customerId: quote.customerId,
          contractName: `Hợp đồng dịch vụ theo báo giá ${quote.quotationCode}`,
          contractValue: quote.totalAmount,
          startDate: new Date(),
          status: 'DRAFT',
          contractContent: `Hợp đồng cung cấp dịch vụ phần mềm được xác lập dựa trên thỏa thuận Báo giá ${quote.quotationCode} ngày ${new Date(quote.createdDate).toLocaleDateString('vi-VN')}. Tổng giá trị hợp đồng: ${Number(quote.totalAmount).toLocaleString('vi-VN')} VNĐ.`,
        },
      });

      // Tự động thêm người ký mặc định từ người liên hệ khách hàng
      if (quote.customer.email) {
        await tx.contractSigner.create({
          data: {
            contractId: contract.id,
            signerName: quote.customer.contactPerson || quote.customer.customerName,
            signerEmail: quote.customer.email,
            signerRole: 'Đại diện Khách hàng',
            signingOrder: 1,
            signingStatus: 'PENDING',
          },
        });
      }

      // FR-37: Lưu nhật ký chuyển đổi
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: 'CONVERT_TO_CONTRACT',
          entityType: 'QUOTATION',
          entityId: id,
          description: `Chuyển đổi thành công báo giá ${quote.quotationCode} thành Hợp đồng ${contract.contractCode}`,
        },
      });

      return contract;
    });
  }

  /**
   * FR-37: XEM LỊCH SỬ CHỈNH SỬA & GỬI BÁO GIÁ
   */
  async getHistory(id: number) {
    await this.findOne(id);

    return this.prisma.activityLog.findMany({
      where: {
        entityType: 'QUOTATION',
        entityId: id,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * XÓA BÁO GIÁ
   */
  async remove(id: number, userId?: number) {
    const quote = await this.findOne(id);

    if (quote.contract) {
      throw new BadRequestException(
        `Không thể xóa báo giá đã liên kết với Hợp đồng "${quote.contract.contractCode}"!`,
      );
    }

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'DELETE_QUOTATION',
        entityType: 'QUOTATION',
        entityId: id,
        description: `Xóa báo giá ${quote.quotationCode}`,
      },
    });

    await this.prisma.quotation.delete({
      where: { id },
    });

    return {
      message: `Đã xóa báo giá "${quote.quotationCode}" thành công!`,
    };
  }
}
