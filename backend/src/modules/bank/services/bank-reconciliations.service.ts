import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { ConfirmReconciliationDto } from '../dto/confirm-reconciliation.dto.js';
import { FilterReconciliationDto } from '../dto/filter-reconciliation.dto.js';
import { ReconciliationMatcherUtil } from '../utils/reconciliation-matcher.util.js';
import {
  ReconciliationStatus,
  MatchStatus,
} from '../constants/bank.constant.js';

@Injectable()
export class BankReconciliationsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Đề xuất đối chiếu cho 1 giao dịch ngân hàng
  async getSuggestions(transactionId: number) {
    const transaction = await this.prisma.bankTransaction.findUnique({
      where: { id: transactionId },
      include: {
        statement: { include: { bankAccount: true } },
        reconciliations: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Không tìm thấy giao dịch ID #${transactionId}`,
      );
    }

    const credit = Number(transaction.creditAmount || 0);
    const debit = Number(transaction.debitAmount || 0);

    if (credit <= 0 && debit <= 0) {
      return { transaction, suggestions: [] };
    }

    const isMoneyIn = credit > 0;

    let salesInvoices: any[] = [];
    let purchaseInvoices: any[] = [];
    let expenses: any[] = [];

    if (isMoneyIn) {
      salesInvoices = await this.prisma.salesInvoice.findMany({
        where: {
          outstandingAmount: { gt: 0 },
          invoiceStatus: { notIn: ['DRAFT', 'CANCELLED'] },
        },
        take: 200,
        include: { customer: true },
        orderBy: { invoiceDate: 'desc' },
      });
    } else {
      [purchaseInvoices, expenses] = await Promise.all([
        this.prisma.purchaseInvoice.findMany({
          where: {
            outstandingAmount: { gt: 0 },
            paymentStatus: { notIn: ['PAID', 'REJECTED'] },
            duplicateStatus: { not: 'DUPLICATE' },
          },
          take: 200,
          orderBy: { invoiceDate: 'desc' },
        }),
        this.prisma.expense.findMany({
          where: { status: 'UNPAID' },
          take: 200,
          orderBy: { expenseDate: 'desc' },
        }),
      ]);
    }

    return ReconciliationMatcherUtil.match(
      transaction,
      salesInvoices,
      purchaseInvoices,
      expenses,
    );
  }

  // 2. Đề xuất đối chiếu cho tất cả giao dịch ngân hàng
  async getAutoMatches() {
    // 1. Lấy danh sách giao dịch chưa hoặc mới đối chiếu một phần
    const candidateTransactions = await this.prisma.bankTransaction.findMany({
      where: {
        reconciliationStatus: {
          in: [
            ReconciliationStatus.UNRECONCILED,
            ReconciliationStatus.PARTIALLY_RECONCILED,
          ],
        },
      },
      take: 50,
      orderBy: { transactionDate: 'desc' },
      include: {
        statement: { include: { bankAccount: true } },
        reconciliations: true,
      },
    });

    if (candidateTransactions.length === 0) {
      return [];
    }

    // 2. KT Có tiền ra hay vào ko ?
    const hasMoneyIn = candidateTransactions.some(
      (tx) => Number(tx.creditAmount || 0) > 0,
    );
    const hasMoneyOut = candidateTransactions.some(
      (tx) => Number(tx.debitAmount || 0) > 0,
    );

    // Có thì lấy hóa đơn bán ra, mua vào, khoản chi hợp lệ (giới hạn 200 bản ghi mới nhất)
    const [salesInvoices, purchaseInvoices, expenses] = await Promise.all([
      hasMoneyIn
        ? this.prisma.salesInvoice.findMany({
            where: {
              outstandingAmount: { gt: 0 },
              invoiceStatus: { notIn: ['DRAFT', 'CANCELLED'] },
            },
            take: 200,
            include: { customer: true },
            orderBy: { invoiceDate: 'desc' },
          })
        : Promise.resolve([]),
      hasMoneyOut
        ? this.prisma.purchaseInvoice.findMany({
            where: {
              outstandingAmount: { gt: 0 },
              paymentStatus: { notIn: ['PAID', 'REJECTED'] },
              duplicateStatus: { not: 'DUPLICATE' },
            },
            take: 200,
            orderBy: { invoiceDate: 'desc' },
          })
        : Promise.resolve([]),
      hasMoneyOut
        ? this.prisma.expense.findMany({
            where: { status: 'UNPAID' },
            take: 200,
            orderBy: { expenseDate: 'desc' },
          })
        : Promise.resolve([]),
    ]);

    // 3. Lấy từng dòng giao dịch
    // so với toàn bộ hóa đơn mua vao, bán ra, khoản chi
    // lấy ra mức độ tin cậy để đề xuất đối chiếu
    const results = [];
    for (const tx of candidateTransactions) {
      const { suggestions } = ReconciliationMatcherUtil.match(
        tx,
        salesInvoices,
        purchaseInvoices,
        expenses,
      );

      // chỉ lấy ra độ tin cậy high và medium
      const goodMatches = suggestions.filter(
        (s) => s.confidence === 'HIGH' || s.confidence === 'MEDIUM',
      );

      if (goodMatches.length > 0) {
        results.push({
          transaction: tx,
          bestMatch: goodMatches[0], // lấy phương án tốt nhất
          otherMatchesCount: goodMatches.length - 1,
        });
      }
    }

    return results;
  }

  // 3. Xác nhận đối chiếu
  async confirm(dto: ConfirmReconciliationDto, userId: number) {
    // phải có đối tượng đối chiếu
    const targetCount = [
      dto.salesInvoiceId,
      dto.purchaseInvoiceId,
      dto.expenseId,
    ].filter(Boolean).length;

    if (targetCount !== 1) {
      throw new BadRequestException(
        'Vui lòng chọn đúng một đối tượng đối chiếu: Hóa đơn bán ra, Hóa đơn mua vào hoặc Khoản chi phí!',
      );
    }

    // phải có giao dịch ngân hàng truyền vào
    const transaction = await this.prisma.bankTransaction.findUnique({
      where: { id: dto.transactionId },
      include: { reconciliations: true },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Không tìm thấy giao dịch ID #${dto.transactionId}`,
      );
    }

    // phải có hđ bán ra, mua vào trùng với giao dịch vào hoặc ra
    const isMoneyIn = Number(transaction.creditAmount) > 0;
    const isMoneyOut = Number(transaction.debitAmount) > 0;

    if (isMoneyIn && !dto.salesInvoiceId) {
      throw new BadRequestException(
        'Giao dịch tiền VÀO chỉ được đối chiếu với Hóa đơn bán ra!',
      );
    }
    if (isMoneyOut && dto.salesInvoiceId) {
      throw new BadRequestException(
        'Giao dịch tiền RA chỉ được đối chiếu với Hóa đơn mua vào hoặc Khoản chi phí!',
      );
    }
    // kt giao dịch này, tiền dư chưa đối chiếu (remainingAvailable)
    // còn bn ?
    const txAmount = Math.max(
      Number(transaction.creditAmount),
      Number(transaction.debitAmount),
    );
    const alreadyMatched = transaction.reconciliations
      .filter((r) => r.matchStatus === MatchStatus.CONFIRMED)
      .reduce((sum, r) => sum + Number(r.matchedAmount), 0);

    const remainingAvailable = txAmount - alreadyMatched;
    // nếu số tiền nhập vào > tiền dư chưa đối chiếu -> lỗi
    if (dto.matchedAmount > remainingAvailable) {
      throw new BadRequestException(
        `Số tiền đối chiếu (${dto.matchedAmount.toLocaleString('vi-VN')} đ) vượt quá số dư còn lại của giao dịch (${remainingAvailable.toLocaleString('vi-VN')} đ)!`,
      );
    }

    /*
     * 1 - tạo đối chiếu
     * 2 - xử lý hóa đơn bán ra (nếu chọn)
     * 3 - xử lý hóa đơn mua vào (nếu chọn)
     * 4 - Xử lý Khoản chi phí (nếu chọn)
     * 5 - Cập nhật trạng thái giao dịch ngân hàng
     */
    // bắt đầu ghi sổ đồng loạt -> sai 1 bước -> rollback
    return this.prisma.$transaction(async (tx) => {
      // 1 Tạo bản ghi đối chiếu
      const reconciliation = await tx.bankReconciliation.create({
        data: {
          transactionId: dto.transactionId,
          salesInvoiceId: dto.salesInvoiceId,
          purchaseInvoiceId: dto.purchaseInvoiceId,
          expenseId: dto.expenseId,
          matchedAmount: dto.matchedAmount,
          matchStatus: MatchStatus.CONFIRMED,
          confirmedBy: userId,
          confirmedAt: new Date(),
          notes: dto.notes,
        },
      });

      // 2 Xử lý Hóa đơn bán ra (Tiền vào ➔ Gạch nợ khách hàng)
      if (dto.salesInvoiceId) {
        const invoice = await tx.salesInvoice.findUnique({
          where: { id: dto.salesInvoiceId },
        });
        if (!invoice)
          throw new NotFoundException(
            `Không tìm thấy hóa đơn bán ra ID #${dto.salesInvoiceId}`,
          );

        const currentPaid = Number(invoice.paidAmount); // khách đã trả
        const currentDebt = Number(invoice.outstandingAmount); // khách nợ

        //matchedAmount tiền nợ mình muốn gạch đi
        if (dto.matchedAmount - currentDebt >= 1) {
          throw new BadRequestException(
            `Số tiền đối chiếu (${dto.matchedAmount.toLocaleString('vi-VN')} đ) vượt quá số nợ hiện tại của hóa đơn (${currentDebt.toLocaleString('vi-VN')} đ)!`,
          );
        }

        // cập nhật lại tờ hóa đơn
        const newPaid = currentPaid + dto.matchedAmount; // tiền đã trả tăng lên
        const newDebt = Math.max(currentDebt - dto.matchedAmount, 0); // tiền nợ giảm đi
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
            transactionReference:
              transaction.referenceCode ||
              transaction.externalTransactionId ||
              `REC-${reconciliation.id}`,
            paymentStatus: 'CONFIRMED',
            note: dto.notes || 'Thanh toán đối chiếu từ sao kê ngân hàng',
          },
        });
      }

      // 3 Xử lý Hóa đơn mua vào (Tiền ra ➔ Gạch nợ nhà cung cấp)
      if (dto.purchaseInvoiceId) {
        const invoice = await tx.purchaseInvoice.findUnique({
          where: { id: dto.purchaseInvoiceId },
        });
        if (!invoice)
          throw new NotFoundException(
            `Không tìm thấy hóa đơn mua vào ID #${dto.purchaseInvoiceId}`,
          );

        const currentDebt = Number(invoice.outstandingAmount);

        //matchedAmount tiền nợ mình muốn gạch đi
        if (dto.matchedAmount - currentDebt >= 1) {
          throw new BadRequestException(
            `Số tiền đối chiếu (${dto.matchedAmount.toLocaleString('vi-VN')} đ) vượt quá số nợ hiện tại của hóa đơn (${currentDebt.toLocaleString('vi-VN')} đ)!`,
          );
        }

        // cập nhật lại tờ hóa đơn
        const newPaid = Number(invoice.paidAmount) + dto.matchedAmount;
        const newDebt = Math.max(
          Number(invoice.outstandingAmount) - dto.matchedAmount,
          0,
        );
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

      // 4 Xử lý Khoản chi phí (Tiền ra ➔ Cập nhật trạng thái PAID)
      if (dto.expenseId) {
        const expense = await tx.expense.findUnique({
          where: { id: dto.expenseId },
        });
        if (!expense)
          throw new NotFoundException(
            `Không tìm thấy khoản chi ID #${dto.expenseId}`,
          );

        await tx.expense.update({
          where: { id: expense.id },
          data: { status: 'PAID' },
        });
      }

      // 5 Cập nhật trạng thái giao dịch ngân hàng
      // txAmount: số tiền gốc giao dịch
      // alreadyMatched: tổng tiền đã đối chiếu trước đó của giao dịch ngân hàng
      // newTotalMatched: để tổng tiền trc giờ sài bn r - tổng tiền đối chiếu
      const newTotalMatched = alreadyMatched + dto.matchedAmount;
      const reconciliationStatus =
        newTotalMatched >= txAmount
          ? ReconciliationStatus.RECONCILED
          : ReconciliationStatus.PARTIALLY_RECONCILED;

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
    // tìm bảng ghi đối chiếu
    const reconciliation = await this.prisma.bankReconciliation.findUnique({
      where: { id },
      include: { transaction: true },
    });

    if (!reconciliation) {
      throw new NotFoundException(`Không tìm thấy bản ghi đối chiếu ID #${id}`);
    }

    // chưa confirm -> xóa nó khỏi bảng đối chiếu
    if (reconciliation.matchStatus !== MatchStatus.CONFIRMED) {
      await this.prisma.bankReconciliation.delete({ where: { id } });
      return { message: 'Đã xóa bản ghi đối chiếu' };
    }

    // số tiền đối chiếu của bảng đối chiếu này
    const matchedAmount = Number(reconciliation.matchedAmount);

    /*
     * 1 - rollback hóa đơn bán ra (nếu chọn)
     * 2 - rollback hóa đơn mua vào (nếu chọn)
     * 3 - rollback Khoản chi phí (nếu chọn)
     * 4 - xóa bảng ghi đối chiếu
     * 5 - Cập nhật trạng thái giao dịch ngân hàng
     */
    return this.prisma.$transaction(async (tx) => {
      // 1. Rollback Hóa đơn bán ra
      if (reconciliation.salesInvoiceId) {
        const invoice = await tx.salesInvoice.findUnique({
          where: { id: reconciliation.salesInvoiceId },
        });

        if (invoice) {
          // lúc trước là cộng tiền trả, trừ tiền nợ
          // giờ thì ngược lại
          const newPaid = Math.max(
            Number(invoice.paidAmount) - matchedAmount,
            0,
          );
          const newDebt = Number(invoice.outstandingAmount) + matchedAmount;
          const paymentStatus = newPaid === 0 ? 'UNPAID' : 'PARTIALLY_PAID';

          // cập nhật hóa đơn bán ra
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
          // lúc trước là cộng tiền trả, trừ tiền nợ
          // giờ thì ngược lại
          const newPaid = Math.max(
            Number(invoice.paidAmount) - matchedAmount,
            0,
          );
          const newDebt = Number(invoice.outstandingAmount) + matchedAmount;
          const paymentStatus = newPaid === 0 ? 'UNPAID' : 'PARTIALLY_PAID';

          // cập nhật hóa đơn mua vào
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
      // remainingReconciliations: bảng ghi đối chiếu còn sót lại có nhãn là confirmed
      // mục đích là tìm ra -> bảng đối chiếu còn lại -> có thể là từ hóa đơn a, b, c
      // nếu có sẽ có giao dịch -> cập nhật đc trái thái giao dịch ngân hàng
      // 1 phần hay chưa chả
      const remainingReconciliations = await tx.bankReconciliation.findMany({
        where: {
          transactionId: reconciliation.transactionId,
          matchStatus: MatchStatus.CONFIRMED,
        },
      });

      // số tiền đang bị sài
      const remainingMatched = remainingReconciliations.reduce(
        (sum, r) => sum + Number(r.matchedAmount),
        0,
      );
      const reconciliationStatus =
        remainingMatched > 0
          ? ReconciliationStatus.PARTIALLY_RECONCILED
          : ReconciliationStatus.UNRECONCILED;

      await tx.bankTransaction.update({
        where: { id: reconciliation.transactionId },
        data: { reconciliationStatus },
      });

      return {
        message:
          'Đã hủy đối chiếu và hoàn trả lại số dư công nợ ban đầu thành công',
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
                include: {
                  bankAccount: {
                    select: { bankName: true, accountNumber: true },
                  },
                },
              },
            },
          },
          salesInvoice: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              customer: { select: { customerName: true } },
            },
          },
          purchaseInvoice: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              supplierName: true,
            },
          },
          expense: {
            select: {
              id: true,
              category: true,
              description: true,
              amount: true,
            },
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
