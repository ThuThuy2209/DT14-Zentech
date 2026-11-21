import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConfirmReconciliationDto } from './dto/confirm-reconciliation.dto.js';
import { FilterReconciliationDto } from './dto/filter-reconciliation.dto.js';

@Injectable()
export class BankReconciliationsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Đề xuất đối chiếu thông minh cho 1 giao dịch ngân hàng
  async getSuggestions(transactionId: number) {
    const transaction = await this.prisma.bankTransaction.findUnique({
      where: { id: transactionId },
      include: { statement: { include: { bankAccount: true } } },
    });

    if (!transaction) {
      throw new NotFoundException(`Không tìm thấy giao dịch ID #${transactionId}`);
    }

    const creditAmount = Number(transaction.creditAmount);
    const debitAmount = Number(transaction.debitAmount);
    const desc = (transaction.description || '').toLowerCase();

    // TRƯỜNG HỢP 1: Tiền vào (Credit) -> Tìm Hóa đơn bán ra (Sales Invoices)
    if (creditAmount > 0) {
      const salesInvoices = await this.prisma.salesInvoice.findMany({
        where: { outstandingAmount: { gt: 0 } },
        include: { customer: true },
        orderBy: { invoiceDate: 'desc' },
      });

      const suggestions = salesInvoices.map((inv) => {
        const debt = Number(inv.outstandingAmount);
        const invNumber = inv.invoiceNumber.toLowerCase();
        const customerName = inv.customer.customerName.toLowerCase();

        // Tiêu chí 1: Khớp đúng số tiền
        const isExactAmount = Math.abs(debt - creditAmount) < 1;
        // Tiêu chí 2: Nội dung chuyển khoản có chứa mã HĐ hoặc tên khách hàng
        const hasInvoiceCode = desc.includes(invNumber);
        const hasCustomerName = customerName
          .split(' ')
          .filter((w) => w.length > 2)
          .some((word) => desc.includes(word));

        // Tiêu chí 3: Khoảng cách ngày (trong vòng 30 ngày)
        const daysDiff = Math.abs(dayjs(transaction.transactionDate).diff(inv.invoiceDate, 'day'));

        // Đánh giá mức độ tin cậy
        let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        const reasons: string[] = [];

        if (isExactAmount && (hasInvoiceCode || hasCustomerName)) {
          confidence = 'HIGH';
          reasons.push('Khớp chính xác số tiền và thông tin khách hàng/số hóa đơn');
        } else if (isExactAmount) {
          confidence = 'MEDIUM';
          reasons.push(`Khớp chính xác số tiền nợ (${debt.toLocaleString('vi-VN')} đ)`);
        } else if (hasInvoiceCode) {
          confidence = 'MEDIUM';
          reasons.push(`Nội dung có số hóa đơn ${inv.invoiceNumber}`);
        } else if (creditAmount < debt && hasCustomerName) {
          confidence = 'MEDIUM';
          reasons.push('Thanh toán một phần tiền nợ cho khách hàng');
        } else if (daysDiff <= 7) {
          confidence = 'LOW';
          reasons.push('Gần thời điểm phát hành hóa đơn');
        }

        return {
          type: 'SALES_INVOICE',
          document: {
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            customerName: inv.customer.customerName,
            totalAmount: Number(inv.totalAmount),
            outstandingAmount: debt,
            invoiceDate: inv.invoiceDate,
            dueDate: inv.dueDate,
          },
          suggestedAmount: Math.min(creditAmount, debt),
          confidence,
          reasons,
        };
      });

      // Sắp xếp: HIGH lên đầu -> MEDIUM -> LOW
      const priority: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return {
        transaction,
        suggestions: suggestions.sort((a, b) => priority[a.confidence] - priority[b.confidence]),
      };
    }

    // TRƯỜNG HỢP 2: Tiền ra (Debit) -> Tìm Hóa đơn mua vào hoặc Khoản chi phí
    const [purchaseInvoices, expenses] = await Promise.all([
      this.prisma.purchaseInvoice.findMany({
        where: { outstandingAmount: { gt: 0 } },
        orderBy: { invoiceDate: 'desc' },
      }),
      this.prisma.expense.findMany({
        where: { status: { not: 'PAID' } },
        orderBy: { expenseDate: 'desc' },
      }),
    ]);

    const suggestions: any[] = [];

    // So khớp Hóa đơn mua vào
    for (const pi of purchaseInvoices) {
      const debt = Number(pi.outstandingAmount);
      const isExact = Math.abs(debt - debitAmount) < 1;
      const hasSupplier = (pi.supplierName || '')
        .toLowerCase()
        .split(' ')
        .filter((w) => w.length > 2)
        .some((word) => desc.includes(word));

      let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      const reasons: string[] = [];

      if (isExact && hasSupplier) {
        confidence = 'HIGH';
        reasons.push('Khớp chính xác số tiền và tên nhà cung cấp');
      } else if (isExact) {
        confidence = 'MEDIUM';
        reasons.push(`Khớp chính xác số tiền còn phải trả (${debt.toLocaleString('vi-VN')} đ)`);
      } else if (hasSupplier) {
        confidence = 'LOW';
        reasons.push('Nội dung nhắc đến tên nhà cung cấp');
      }

      suggestions.push({
        type: 'PURCHASE_INVOICE',
        document: {
          id: pi.id,
          invoiceNumber: pi.invoiceNumber,
          supplierName: pi.supplierName,
          totalAmount: Number(pi.totalAmount),
          outstandingAmount: debt,
          invoiceDate: pi.invoiceDate,
        },
        suggestedAmount: Math.min(debitAmount, debt),
        confidence,
        reasons,
      });
    }

    // So khớp Khoản chi phí
    for (const exp of expenses) {
      const expAmount = Number(exp.amount);
      const isExact = Math.abs(expAmount - debitAmount) < 1;
      const expDesc = (exp.description || '').toLowerCase();
      const hasKeyword = expDesc
        .split(' ')
        .filter((w) => w.length > 2)
        .some((word) => desc.includes(word));

      let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      const reasons: string[] = [];

      if (isExact && hasKeyword) {
        confidence = 'HIGH';
        reasons.push('Khớp chính xác số tiền và nội dung khoản chi');
      } else if (isExact) {
        confidence = 'MEDIUM';
        reasons.push(`Khớp đúng số tiền chi (${expAmount.toLocaleString('vi-VN')} đ)`);
      }

      suggestions.push({
        type: 'EXPENSE',
        document: {
          id: exp.id,
          category: exp.category,
          description: exp.description,
          amount: expAmount,
          expenseDate: exp.expenseDate,
        },
        suggestedAmount: expAmount,
        confidence,
        reasons,
      });
    }

    const priority: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    return {
      transaction,
      suggestions: suggestions.sort((a, b) => priority[a.confidence] - priority[b.confidence]),
    };
  }

  // 2. Tự động quét và lấy danh sách các giao dịch chưa đối chiếu kèm đề xuất
  async getAutoMatches() {
    const unreconciledTransactions = await this.prisma.bankTransaction.findMany({
      where: { reconciliationStatus: 'UNRECONCILED' },
      take: 50,
      orderBy: { transactionDate: 'desc' },
      include: { statement: { include: { bankAccount: true } } },
    });

    const results = [];
    for (const tx of unreconciledTransactions) {
      const { suggestions } = await this.getSuggestions(tx.id);
      // Chỉ lấy các giao dịch có ít nhất 1 gợi ý độ tin cậy HIGH hoặc MEDIUM
      const goodMatches = suggestions.filter((s) => s.confidence === 'HIGH' || s.confidence === 'MEDIUM');
      if (goodMatches.length > 0) {
        results.push({
          transaction: tx,
          bestMatch: goodMatches[0],
          otherMatchesCount: goodMatches.length - 1,
        });
      }
    }

    return results;
  }

  // 3. Xác nhận đối chiếu (Prisma Transaction cập nhật gạch nợ & tạo payment)
  async confirm(dto: ConfirmReconciliationDto, userId: number) {
    // Quy tắc: Đúng 1 trong 3 trường phải có giá trị
    const targetCount = [dto.salesInvoiceId, dto.purchaseInvoiceId, dto.expenseId].filter(Boolean).length;
    if (targetCount !== 1) {
      throw new BadRequestException(
        'Vui lòng chọn đúng một đối tượng đối chiếu: Hóa đơn bán ra, Hóa đơn mua vào hoặc Khoản chi phí!',
      );
    }

    // 1. Kiểm tra giao dịch ngân hàng
    const transaction = await this.prisma.bankTransaction.findUnique({
      where: { id: dto.transactionId },
      include: { reconciliations: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Không tìm thấy giao dịch ID #${dto.transactionId}`);
    }

    const txAmount = Math.max(Number(transaction.creditAmount), Number(transaction.debitAmount));
    const alreadyMatched = transaction.reconciliations
      .filter((r) => r.matchStatus === 'CONFIRMED')
      .reduce((sum, r) => sum + Number(r.matchedAmount), 0);

    const remainingAvailable = txAmount - alreadyMatched;
    if (dto.matchedAmount > remainingAvailable) {
      throw new BadRequestException(
        `Số tiền đối chiếu (${dto.matchedAmount.toLocaleString('vi-VN')} đ) vượt quá số dư còn lại của giao dịch (${remainingAvailable.toLocaleString('vi-VN')} đ)!`,
      );
    }

    // 2. Chạy Prisma Transaction an toàn
    return this.prisma.$transaction(async (tx) => {
      // 2.1 Tạo bản ghi đối chiếu
      const reconciliation = await tx.bankReconciliation.create({
        data: {
          transactionId: dto.transactionId,
          salesInvoiceId: dto.salesInvoiceId,
          purchaseInvoiceId: dto.purchaseInvoiceId,
          expenseId: dto.expenseId,
          matchedAmount: dto.matchedAmount,
          matchStatus: 'CONFIRMED',
          confirmedBy: userId,
          confirmedAt: new Date(),
          notes: dto.notes,
        },
      });

      // 2.2 Xử lý Hóa đơn bán ra (Tiền vào ➔ Gạch nợ khách hàng)
      if (dto.salesInvoiceId) {
        const invoice = await tx.salesInvoice.findUnique({
          where: { id: dto.salesInvoiceId },
        });
        if (!invoice) throw new NotFoundException(`Không tìm thấy hóa đơn bán ra ID #${dto.salesInvoiceId}`);

        const currentPaid = Number(invoice.paidAmount);
        const currentDebt = Number(invoice.outstandingAmount);
        const newPaid = currentPaid + dto.matchedAmount;
        const newDebt = Math.max(currentDebt - dto.matchedAmount, 0);
        const paymentStatus = newDebt === 0 ? 'PAID' : 'PARTIALLY_PAID';

        await tx.salesInvoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaid,
            outstandingAmount: newDebt,
            paymentStatus,
            invoiceStatus: newDebt === 0 ? 'PAID' : invoice.invoiceStatus,
          },
        });

        // Tạo bản ghi Thanh toán (Payment)
        await tx.payment.create({
          data: {
            salesInvoiceId: invoice.id,
            paymentDate: transaction.transactionDate,
            amount: dto.matchedAmount,
            paymentMethod: 'BANK_TRANSFER',
            transactionReference: transaction.referenceCode || transaction.externalTransactionId || `REC-${reconciliation.id}`,
            paymentStatus: 'CONFIRMED',
            note: dto.notes || 'Thanh toán đối chiếu từ sao kê ngân hàng',
          },
        });
      }

      // 2.3 Xử lý Hóa đơn mua vào (Tiền ra ➔ Gạch nợ nhà cung cấp)
      if (dto.purchaseInvoiceId) {
        const invoice = await tx.purchaseInvoice.findUnique({
          where: { id: dto.purchaseInvoiceId },
        });
        if (!invoice) throw new NotFoundException(`Không tìm thấy hóa đơn mua vào ID #${dto.purchaseInvoiceId}`);

        const newPaid = Number(invoice.paidAmount) + dto.matchedAmount;
        const newDebt = Math.max(Number(invoice.outstandingAmount) - dto.matchedAmount, 0);
        const paymentStatus = newDebt === 0 ? 'PAID' : 'PARTIALLY_PAID';

        await tx.purchaseInvoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaid,
            outstandingAmount: newDebt,
            paymentStatus,
          },
        });
      }

      // 2.4 Xử lý Khoản chi phí (Tiền ra ➔ Cập nhật trạng thái PAID)
      if (dto.expenseId) {
        const expense = await tx.expense.findUnique({
          where: { id: dto.expenseId },
        });
        if (!expense) throw new NotFoundException(`Không tìm thấy khoản chi ID #${dto.expenseId}`);

        await tx.expense.update({
          where: { id: expense.id },
          data: { status: 'PAID' },
        });
      }

      // 2.5 Cập nhật trạng thái giao dịch ngân hàng
      const newTotalMatched = alreadyMatched + dto.matchedAmount;
      const reconciliationStatus = newTotalMatched >= txAmount ? 'RECONCILED' : 'PARTIALLY_RECONCILED';

      await tx.bankTransaction.update({
        where: { id: transaction.id },
        data: { reconciliationStatus },
      });

      return {
        message: 'Xác nhận đối chiếu và cập nhật công nợ thành công',
        reconciliation,
      };
    });
  }

  // 4. Hủy kết quả đối chiếu (Rollback công nợ về trạng thái cũ)
  async remove(id: number) {
    const reconciliation = await this.prisma.bankReconciliation.findUnique({
      where: { id },
      include: { transaction: true },
    });

    if (!reconciliation) {
      throw new NotFoundException(`Không tìm thấy bản ghi đối chiếu ID #${id}`);
    }

    if (reconciliation.matchStatus !== 'CONFIRMED') {
      await this.prisma.bankReconciliation.delete({ where: { id } });
      return { message: 'Đã xóa bản ghi đối chiếu' };
    }

    const matchedAmount = Number(reconciliation.matchedAmount);

    return this.prisma.$transaction(async (tx) => {
      // 1. Rollback Hóa đơn bán ra
      if (reconciliation.salesInvoiceId) {
        const invoice = await tx.salesInvoice.findUnique({
          where: { id: reconciliation.salesInvoiceId },
        });

        if (invoice) {
          const newPaid = Math.max(Number(invoice.paidAmount) - matchedAmount, 0);
          const newDebt = Number(invoice.outstandingAmount) + matchedAmount;
          const paymentStatus = newPaid === 0 ? 'UNPAID' : 'PARTIALLY_PAID';

          await tx.salesInvoice.update({
            where: { id: invoice.id },
            data: {
              paidAmount: newPaid,
              outstandingAmount: newDebt,
              paymentStatus,
              invoiceStatus: newPaid === 0 ? 'ISSUED' : invoice.invoiceStatus,
            },
          });

          // Xóa bản ghi Payment gần nhất có số tiền tương ứng
          const payment = await tx.payment.findFirst({
            where: {
              salesInvoiceId: invoice.id,
              amount: matchedAmount,
              paymentMethod: 'BANK_TRANSFER',
            },
            orderBy: { createdAt: 'desc' },
          });
          if (payment) {
            await tx.payment.delete({ where: { id: payment.id } });
          }
        }
      }

      // 2. Rollback Hóa đơn mua vào
      if (reconciliation.purchaseInvoiceId) {
        const invoice = await tx.purchaseInvoice.findUnique({
          where: { id: reconciliation.purchaseInvoiceId },
        });

        if (invoice) {
          const newPaid = Math.max(Number(invoice.paidAmount) - matchedAmount, 0);
          const newDebt = Number(invoice.outstandingAmount) + matchedAmount;
          const paymentStatus = newPaid === 0 ? 'UNPAID' : 'PARTIALLY_PAID';

          await tx.purchaseInvoice.update({
            where: { id: invoice.id },
            data: {
              paidAmount: newPaid,
              outstandingAmount: newDebt,
              paymentStatus,
            },
          });
        }
      }

      // 3. Rollback Khoản chi phí
      if (reconciliation.expenseId) {
        await tx.expense.update({
          where: { id: reconciliation.expenseId },
          data: { status: 'UNPAID' },
        });
      }

      // 4. Xóa bản ghi đối chiếu
      await tx.bankReconciliation.delete({ where: { id } });

      // 5. Cập nhật lại trạng thái giao dịch ngân hàng
      const remainingReconciliations = await tx.bankReconciliation.findMany({
        where: { transactionId: reconciliation.transactionId, matchStatus: 'CONFIRMED' },
      });

      const remainingMatched = remainingReconciliations.reduce((sum, r) => sum + Number(r.matchedAmount), 0);
      const reconciliationStatus = remainingMatched > 0 ? 'PARTIALLY_RECONCILED' : 'UNRECONCILED';

      await tx.bankTransaction.update({
        where: { id: reconciliation.transactionId },
        data: { reconciliationStatus },
      });

      return {
        message: 'Đã hủy đối chiếu và hoàn trả lại số dư công nợ ban đầu thành công',
      };
    });
  }

  // 5. Lấy danh sách lịch sử đối chiếu
  async findAll(query: FilterReconciliationDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 20, 1);
    const where: any = {};

    if (query.transactionId) where.transactionId = Number(query.transactionId);
    if (query.matchStatus) where.matchStatus = query.matchStatus;

    const [items, total] = await Promise.all([
      this.prisma.bankReconciliation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { confirmedAt: 'desc' },
        include: {
          transaction: {
            include: {
              statement: {
                include: { bankAccount: { select: { bankName: true, accountNumber: true } } },
              },
            },
          },
          salesInvoice: {
            select: { id: true, invoiceNumber: true, totalAmount: true, customer: { select: { customerName: true } } },
          },
          purchaseInvoice: {
            select: { id: true, invoiceNumber: true, totalAmount: true, supplierName: true },
          },
          expense: {
            select: { id: true, category: true, description: true, amount: true },
          },
          confirmer: {
            select: { id: true, fullName: true, username: true },
          },
        },
      }),
      this.prisma.bankReconciliation.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
