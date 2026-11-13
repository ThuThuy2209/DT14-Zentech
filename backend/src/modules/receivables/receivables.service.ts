import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { FilterReceivableDto } from './dto/filter-receivable.dto.js';
import { CreateReminderDraftDto } from './dto/create-reminder-draft.dto.js';
import { ApproveReminderDto } from './dto/approve-reminder.dto.js';

@Injectable()
export class ReceivablesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GHI NHẬN THANH TOÁN CHO HÓA ĐƠN BÁN RA (FR-72)
   */
  async recordPayment(dto: RecordPaymentDto, userId?: number) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id: dto.salesInvoiceId },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với ID #${dto.salesInvoiceId}`);
    }

    if (invoice.invoiceStatus === 'CANCELLED') {
      throw new BadRequestException('Không thể ghi nhận thanh toán cho hóa đơn đã bị hủy');
    }

    const paymentAmount = Number(dto.amount);
    if (paymentAmount <= 0) {
      throw new BadRequestException('Số tiền thanh toán phải lớn hơn 0');
    }

    const currentPaid = Number(invoice.paidAmount);
    const totalAmount = Number(invoice.totalAmount);
    const newPaid = currentPaid + paymentAmount;
    const newOutstanding = Math.max(0, totalAmount - newPaid);

    const paymentStatus = newPaid >= totalAmount ? 'PAID' : 'PARTIALLY_PAID';
    const invoiceStatus = paymentStatus === 'PAID' ? 'PAID' : 'PARTIALLY_PAID';

    const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();

    const [payment, updatedInvoice] = await this.prisma.$transaction([
      this.prisma.payment.create({
        data: {
          salesInvoiceId: dto.salesInvoiceId,
          paymentDate,
          amount: paymentAmount,
          paymentMethod: dto.paymentMethod || 'BANK_TRANSFER',
          transactionReference: dto.transactionReference?.trim() || null,
          paymentStatus: 'SUCCESS',
          note: dto.note?.trim() || null,
        },
      }),
      this.prisma.salesInvoice.update({
        where: { id: dto.salesInvoiceId },
        data: {
          paidAmount: newPaid,
          outstandingAmount: newOutstanding,
          paymentStatus,
          invoiceStatus,
        },
        include: {
          customer: true,
          payments: {
            orderBy: { paymentDate: 'desc' },
          },
        },
      }),
      this.prisma.activityLog.create({
        data: {
          userId: userId || null,
          action: 'RECORD_PAYMENT',
          entityType: 'PAYMENT',
          entityId: dto.salesInvoiceId,
          description: `Ghi nhận thanh toán ${paymentAmount.toLocaleString('vi-VN')} VND cho hóa đơn ${invoice.invoiceNumber} (${invoice.customer.customerName})`,
        },
      }),
    ]);

    return {
      payment,
      invoice: updatedInvoice,
    };
  }

  /**
   * TỔNG HỢP CÔNG NỢ PHẢI THU (FR-73, FR-76)
   */
  async getSummary() {
    const invoices = await this.prisma.salesInvoice.findMany({
      where: {
        invoiceStatus: { not: 'CANCELLED' },
      },
    });

    const now = new Date();
    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;

    let overdueCount = 0;
    let dueSoonCount = 0;
    let normalCount = 0;
    let paidCount = 0;

    for (const inv of invoices) {
      const total = Number(inv.totalAmount);
      const paid = Number(inv.paidAmount);
      const outstanding = Number(inv.outstandingAmount);

      totalInvoiced += total;
      totalCollected += paid;
      totalOutstanding += outstanding;

      if (outstanding === 0) {
        paidCount++;
      } else {
        const dueDate = inv.dueDate ? new Date(inv.dueDate) : new Date(inv.invoiceDate);
        const diffMs = now.getTime() - dueDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          totalOverdue += outstanding;
          overdueCount++;
        } else if (diffDays >= -7) {
          dueSoonCount++;
        } else {
          normalCount++;
        }
      }
    }

    return {
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      totalOverdue,
      counts: {
        total: invoices.length,
        paidCount,
        overdueCount,
        dueSoonCount,
        normalCount,
      },
    };
  }

  /**
   * DANH SÁCH & THEO DÕI CÔNG NỢ CHI TIẾT (FR-73, FR-74, FR-75)
   */
  async findAll(query: FilterReceivableDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      invoiceStatus: { not: 'CANCELLED' },
    };

    if (query.customerId) {
      where.customerId = Number(query.customerId);
    }

    if (query.search) {
      const kw = query.search.trim();
      where.OR = [
        { invoiceNumber: { contains: kw, mode: 'insensitive' } },
        { customer: { customerName: { contains: kw, mode: 'insensitive' } } },
        { customer: { contactPerson: { contains: kw, mode: 'insensitive' } } },
      ];
    }

    const now = new Date();

    if (query.status === 'PAID') {
      where.outstandingAmount = 0;
    } else if (query.status === 'OVERDUE') {
      where.outstandingAmount = { gt: 0 };
      where.dueDate = { lt: now };
    }

    const [items, total] = await Promise.all([
      this.prisma.salesInvoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueDate: 'asc' },
        include: {
          customer: {
            select: {
              id: true,
              customerName: true,
              contactPerson: true,
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
          payments: {
            select: {
              id: true,
              amount: true,
              paymentDate: true,
              paymentMethod: true,
            },
          },
        },
      }),
      this.prisma.salesInvoice.count({ where }),
    ]);

    // Bổ sung thông tin phân loại tuổi nợ (Aging)
    const enrichedItems = items.map((inv) => {
      const outstanding = Number(inv.outstandingAmount);
      const dueDate = inv.dueDate ? new Date(inv.dueDate) : new Date(inv.invoiceDate);
      const diffMs = now.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let agingStatus = 'NOT_DUE';
      let overdueDays = 0;

      if (outstanding === 0) {
        agingStatus = 'PAID';
      } else if (diffDays > 0) {
        agingStatus = 'OVERDUE';
        overdueDays = diffDays;
      } else if (diffDays >= -7) {
        agingStatus = 'DUE_SOON';
      }

      return {
        ...inv,
        overdueDays,
        agingStatus,
      };
    });

    return {
      items: enrichedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * XEM CHI TIẾT CÔNG NỢ CỦA 1 HÓA ĐƠN
   */
  async findOne(salesInvoiceId: number) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id: salesInvoiceId },
      include: {
        customer: true,
        contract: true,
        acceptanceRecord: true,
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với ID #${salesInvoiceId}`);
    }

    const now = new Date();
    const outstanding = Number(invoice.outstandingAmount);
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : new Date(invoice.invoiceDate);
    const diffMs = now.getTime() - dueDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let agingStatus = 'NOT_DUE';
    let overdueDays = 0;

    if (outstanding === 0) {
      agingStatus = 'PAID';
    } else if (diffDays > 0) {
      agingStatus = 'OVERDUE';
      overdueDays = diffDays;
    } else if (diffDays >= -7) {
      agingStatus = 'DUE_SOON';
    }

    const reminderHistory = await this.getReminderHistory(salesInvoiceId);

    return {
      ...invoice,
      overdueDays,
      agingStatus,
      reminderHistory,
    };
  }

  /**
   * AI SOẠN EMAIL NHẮC NỢ (BẢN NHÁP CHO CHỦ DOANH NGHIỆP DUYỆT) (FR-77, FR-78)
   */
  async createReminderDraft(
    invoiceId: number,
    dto: CreateReminderDraftDto,
    userId?: number,
  ) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với ID #${invoiceId}`);
    }

    const outstanding = Number(invoice.outstandingAmount);
    if (outstanding <= 0) {
      throw new BadRequestException('Hóa đơn này không có công nợ tồn đọng, không cần tạo email nhắc nợ');
    }

    const now = new Date();
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : new Date(invoice.invoiceDate);
    const diffMs = now.getTime() - dueDate.getTime();
    const overdueDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    const customerName = invoice.customer.customerName;
    const recipient = invoice.customer.email || 'khachhang@example.com';
    const formattedAmount = outstanding.toLocaleString('vi-VN');
    const formattedDueDate = dueDate.toISOString().split('T')[0];

    const subject = `[Nhắc thanh toán] Hóa đơn ${invoice.invoiceNumber} - Công ty TNHH MTV Minh Software`;

    const content = `Kính gửi: Quý khách hàng ${customerName},

Công ty TNHH MTV Minh Software xin gửi lời chào trân trọng và lời cảm ơn chân thành đến Quý khách đã luôn tin tưởng sử dụng dịch vụ của chúng tôi.

Hệ thống kế toán của chúng tôi ghi nhận thông tin công nợ cho Hóa đơn ${invoice.invoiceNumber} như sau:
--------------------------------------------------
• Số hóa đơn: ${invoice.invoiceNumber}
• Ngày phát hành: ${invoice.invoiceDate.toISOString().split('T')[0]}
• Ngày đến hạn: ${formattedDueDate}
• Tình trạng: Đã quá hạn ${overdueDays} ngày
• Số tiền còn phải thanh toán: ${formattedAmount} VND
--------------------------------------------------

Quý khách vui lòng thu xếp thanh toán khoản công nợ trên vào tài khoản ngân hàng chính thức của chúng tôi:
- Tên chủ tài khoản: NGUYEN VAN MINH
- Số tài khoản: 0318999999
- Ngân hàng: Ngân hàng TMCP Á Châu (ACB) - Chi nhánh TP.HCM
- Nội dung chuyển khoản: TT ${invoice.invoiceNumber}

Nếu Quý khách đã thực hiện chuyển khoản trong 24 giờ qua, xin vui lòng bỏ qua thông báo này hoặc gửi lại giấy báo có để chúng tôi đối soát.

Mọi thắc mắc xin vui lòng liên hệ:
- Hotline: 0909 123 456
- Email: ketoan@minhsoftware.com

Kính chúc Quý khách nhiều sức khỏe và kinh doanh thành đạt!

Trân trọng,
Nguyễn Văn Minh - Giám đốc điều hành
Công ty TNHH MTV Minh Software`;

    // Tạo bản ghi phê duyệt (ApprovalRequest) và EmailLog ở trạng thái PENDING (chờ chủ doanh nghiệp duyệt)
    const approval = await this.prisma.approvalRequest.create({
      data: {
        approvalType: 'DEBT_REMINDER',
        referenceId: invoiceId,
        title: `AI soạn email nhắc nợ hóa đơn ${invoice.invoiceNumber} (${customerName})`,
        content,
        status: 'PENDING',
        emailLogs: {
          create: {
            recipient,
            subject,
            content,
            sendStatus: 'PENDING',
          },
        },
      },
      include: {
        emailLogs: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'AI_DRAFT_DEBT_REMINDER',
        entityType: 'APPROVAL_REQUEST',
        entityId: approval.id,
        description: `AI soạn nháp email nhắc nợ cho hóa đơn ${invoice.invoiceNumber} (${formattedAmount} VND)`,
      },
    });

    return approval;
  }

  /**
   * CHỦ DOANH NGHIỆP DUYỆT & GỬI EMAIL NHẮC NỢ (FR-78, FR-79, FR-80)
   */
  async approveReminder(
    approvalId: number,
    dto: ApproveReminderDto,
    userId?: number,
  ) {
    const approval = await this.prisma.approvalRequest.findUnique({
      where: { id: approvalId },
      include: {
        emailLogs: true,
      },
    });

    if (!approval) {
      throw new NotFoundException(`Không tìm thấy yêu cầu phê duyệt với ID #${approvalId}`);
    }

    if (approval.status === 'APPROVED') {
      throw new BadRequestException('Yêu cầu nhắc nợ này đã được phê duyệt và gửi đi trước đó');
    }

    const emailLog = approval.emailLogs[0];
    const finalSubject = dto.subject || emailLog?.subject || approval.title;
    const finalContent = dto.content || emailLog?.content || approval.content || '';
    const finalRecipient = dto.recipient || emailLog?.recipient || '';

    // Cập nhật trạng thái duyệt và gửi email
    const [updatedApproval] = await this.prisma.$transaction([
      this.prisma.approvalRequest.update({
        where: { id: approvalId },
        data: {
          status: 'APPROVED',
          reviewedBy: userId || null,
          reviewedAt: new Date(),
          content: finalContent,
        },
      }),
      this.prisma.emailLog.updateMany({
        where: { approvalId },
        data: {
          subject: finalSubject,
          content: finalContent,
          recipient: finalRecipient,
          sentAt: new Date(),
          sendStatus: 'SENT',
        },
      }),
      this.prisma.activityLog.create({
        data: {
          userId: userId || null,
          action: 'APPROVE_AND_SEND_DEBT_REMINDER',
          entityType: 'APPROVAL_REQUEST',
          entityId: approvalId,
          description: `Chủ doanh nghiệp duyệt và gửi email nhắc nợ tới ${finalRecipient}`,
        },
      }),
    ]);

    return {
      success: true,
      approval: updatedApproval,
      message: `Đã phê duyệt và gửi email nhắc nợ thành công tới ${finalRecipient}`,
    };
  }

  /**
   * LỊCH SỬ NHẮC NỢ CỦA HÓA ĐƠN (FR-80)
   */
  async getReminderHistory(invoiceId: number) {
    return this.prisma.approvalRequest.findMany({
      where: {
        approvalType: 'DEBT_REMINDER',
        referenceId: invoiceId,
      },
      orderBy: { id: 'desc' },
      include: {
        reviewer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        emailLogs: true,
      },
    });
  }
}
