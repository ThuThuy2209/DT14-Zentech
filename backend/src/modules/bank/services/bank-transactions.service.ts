import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { FilterTransactionDto } from '../dto/filter-transaction.dto.js';
import { TransactionType } from '../constants/bank.constant.js';

@Injectable()
export class BankTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Lấy danh sách giao dịch ngân hàng (hỗ trợ lọc thu/chi, trạng thái, tìm kiếm, ngày tháng)
  async findAll(query: FilterTransactionDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 20, 1);
    const where: any = {};

    if (query.statementId) where.statementId = Number(query.statementId);
    if (query.accountId) {
      where.statement = { accountId: Number(query.accountId) };
    }
    if (query.reconciliationStatus) {
      where.reconciliationStatus = query.reconciliationStatus;
    }
    if (query.type === TransactionType.IN) where.creditAmount = { gt: 0 };
    else if (query.type === TransactionType.OUT) where.debitAmount = { gt: 0 };

    if (query.search) {
      const kw = query.search.trim();
      where.OR = [
        { description: { contains: kw, mode: 'insensitive' } },
        { referenceCode: { contains: kw, mode: 'insensitive' } },
        { externalTransactionId: { contains: kw, mode: 'insensitive' } },
      ];
    }

    if (query.fromDate || query.toDate) {
      where.transactionDate = {};
      if (query.fromDate) {
        where.transactionDate.gte = dayjs(query.fromDate)
          .startOf('day')
          .toDate();
      }
      if (query.toDate) {
        where.transactionDate.lte = dayjs(query.toDate).endOf('day').toDate();
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.bankTransaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { transactionDate: 'desc' },
        include: {
          statement: {
            include: {
              bankAccount: {
                select: { id: true, bankName: true, accountNumber: true },
              },
            },
          },
          reconciliations: true,
        },
      }),
      this.prisma.bankTransaction.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // 2. Lấy chi tiết 1 giao dịch ngân hàng
  async findOne(id: number) {
    const item = await this.prisma.bankTransaction.findUnique({
      where: { id },
      include: {
        statement: {
          include: {
            bankAccount: true,
          },
        },
        reconciliations: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy giao dịch ID #${id}`);
    }

    return item;
  }
}
