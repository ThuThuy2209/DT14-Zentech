import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto'; // Node.js built-in
import dayjs from 'dayjs';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FilterStatementDto } from './dto/filter-statement.dto.js';
import {
  ExpressMulterFile,
  StatementParserUtil,
} from './utils/statement-parser.util.js';

@Injectable()
export class BankStatementsService {
  constructor(private readonly prisma: PrismaService) {}
  // 1. upload file dựa vào: accountId -> bank-account, userId (importedBy) -> user
  async uploadStatement(
    file: ExpressMulterFile,
    accountId: number,
    userId: number,
  ) {
    // file.buffer : chỉ xuất hiện khi lưu file vào RAM
    if (!file?.buffer) {
      throw new BadRequestException(
        'Vui lòng chọn tệp sao kê ngân hàng (Excel/CSV)!',
      );
    }

    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException(
        `Không tìm thấy tài khoản ngân hàng ID #${accountId}`,
      );
    }

    // createHash : tạo đối tượng hash từ thuật toán truyền vào
    // update(file.buffer) : nạp nội dung file vào hash
    // digest : xuất ra hash dạng hex
    const fileHash = createHash('sha256').update(file.buffer).digest('hex');
    const existed = await this.prisma.bankStatement.findFirst({
      where: { fileHash },
      include: { bankAccount: true },
    });

    if (existed) {
      throw new ConflictException(
        `Tệp đã được tải lên ngày ${dayjs(existed.importedAt).format('DD/MM/YYYY')} cho tài khoản ${existed.bankAccount.bankName}. Vui lòng không tải lại tệp trùng lặp.`,
      );
    }

    // rows = thư viện xlsx đọc file excel/CSV -> parse thành mảng các object đã được clean dữ liệu
    // (ngày tháng, số tiền, loại giao dịch,...) -> trả về mảng các dòng giao dịch
    const rows = StatementParserUtil.parse(file.buffer);

    if (!rows.length) {
      throw new BadRequestException(
        'Tệp sao kê không có dữ liệu hợp lệ. Vui lòng kiểm tra định dạng cột (Ngày GD, Nội dung, Tiền vào, Tiền ra, Số dư).',
      );
    }

    // Xác định kỳ sao kê
    const timestamps = rows.map((r) => r.transactionDate.getTime());
    const periodStart = new Date(Math.min(...timestamps));
    const periodEnd = new Date(Math.max(...timestamps));

    // Lấy giao dịch cũ trong database để so sánh trùng lặp
    // existingTxns so với rows(giao dịch mới)
    const existingTxns = await this.prisma.bankTransaction.findMany({
      where: {
        statement: {
          accountId: accountId,
        }, // bankTransaction - bankStatement - bankAccount
        transactionDate: { gte: periodStart, lte: periodEnd },
      },
      select: {
        transactionDate: true,
        creditAmount: true,
        debitAmount: true,
        description: true,
      },
    });

    return this.prisma.$transaction(async (tx) => {
      // 1. lưu file sao kê vào bảng bankStatement
      const statement = await tx.bankStatement.create({
        data: {
          accountId: accountId,
          fileName: file.originalname,
          periodStart: periodStart,
          periodEnd: periodEnd,
          fileHash: fileHash,
          importStatus: 'SUCCESS',
          importedBy: userId,
        },
      });

      // 2. Lưu các dòng giao dịch vào bảng bankTransaction
      let dupCount = 0; // Giao dịch trùng lặp
      let totalIn = 0; // Tổng tiền vào
      let totalOut = 0; // Tổng tiền ra

      const txnData = rows.map((row) => {
        totalIn += row.creditAmount;
        totalOut += row.debitAmount;

        const isDup = existingTxns.some(
          (e) =>
            dayjs(e.transactionDate).isSame(row.transactionDate, 'day') &&
            Number(e.creditAmount) === row.creditAmount &&
            Number(e.debitAmount) === row.debitAmount &&
            e.description?.trim().toLowerCase() ===
              row.description.trim().toLowerCase(),
        );
        if (isDup) dupCount++;

        return {
          statementId: statement.id,
          externalTransactionId: row.externalTransactionId,
          transactionDate: row.transactionDate,
          description: row.description,
          debitAmount: row.debitAmount,
          creditAmount: row.creditAmount,
          balanceAfter: row.balanceAfter,
          referenceCode: row.referenceCode,
          duplicateStatus: isDup ? 'DUPLICATE' : 'UNIQUE',
          reconciliationStatus: 'UNRECONCILED',
        };
      });

      await tx.bankTransaction.createMany({ data: txnData });

      return {
        statement: {
          id: statement.id,
          fileName: statement.fileName,
          periodStart: statement.periodStart,
          periodEnd: statement.periodEnd,
          importedAt: statement.importedAt,
          bankAccount: {
            id: account.id,
            bankName: account.bankName,
            accountNumber: account.accountNumber,
          },
        },
        summary: {
          totalTransactions: rows.length,
          duplicateTransactions: dupCount,
          uniqueTransactions: rows.length - dupCount,
          totalCreditAmount: totalIn,
          totalDebitAmount: totalOut,
        },
      };
    });
  }

  // 2. Danh sách đợt sao kê
  async findAllStatements(query: FilterStatementDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);
    const where: any = {};

    if (query.accountId) where.accountId = Number(query.accountId);

    const [items, total] = await Promise.all([
      this.prisma.bankStatement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { importedAt: 'desc' },
        include: {
          bankAccount: {
            select: {
              id: true,
              bankName: true,
              accountNumber: true,
              accountHolder: true,
            },
          },
          importer: { select: { id: true, fullName: true, username: true } },
          _count: { select: { transactions: true } },
        },
      }),
      this.prisma.bankStatement.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // 3. Chi tiết đợt sao kê
  async findOneStatement(id: number) {
    const item = await this.prisma.bankStatement.findUnique({
      where: { id },
      include: {
        bankAccount: true,
        importer: { select: { id: true, fullName: true, username: true } },
        _count: { select: { transactions: true } },
      },
    });
    if (!item)
      throw new NotFoundException(`Không tìm thấy đợt sao kê ID #${id}`);
    return item;
  }

  // 4. Xóa đợt sao kê (không cho xóa nếu đã đối chiếu)
  async removeStatement(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.bankStatement.findUnique({
        where: { id },
        include: { transactions: { include: { reconciliations: true } } },
      });

      if (!item)
        throw new NotFoundException(`Không tìm thấy đợt sao kê ID #${id}`);

      const hasReconciled = item.transactions.some(
        (t) =>
          t.reconciliationStatus === 'RECONCILED' ||
          t.reconciliations.some((r) => r.matchStatus === 'CONFIRMED'),
      );
      if (hasReconciled) {
        throw new BadRequestException(
          'Đợt sao kê đã có giao dịch được xác nhận đối chiếu, không thể xóa.',
        );
      }

      await tx.bankStatement.delete({ where: { id } });
      return {
        message: `Đã xóa đợt sao kê "${item.fileName}" và ${item.transactions.length} giao dịch`,
      };
    });
  }
}
