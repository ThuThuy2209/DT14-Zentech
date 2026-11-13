import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { FilterExpenseDto } from './dto/filter-expense.dto.js';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  //  Tạo khoản chi phí mới
  async create(createExpenseDto: CreateExpenseDto) {
    // 1. Kiểm tra tài liệu chứng từ đính kèm (nếu có truyền)
    if (createExpenseDto.documentId) {
      const doc = await this.prisma.document.findUnique({
        where: { id: createExpenseDto.documentId },
      });
      if (!doc) {
        throw new NotFoundException(
          `Không tìm thấy tài liệu chứng từ với ID #${createExpenseDto.documentId}`,
        );
      }
    }

    // Tạo bản ghi chi phí
    return this.prisma.expense.create({
      data: {
        category: createExpenseDto.category.trim(),
        description: createExpenseDto.description?.trim() || null,
        amount: createExpenseDto.amount,
        expenseDate: new Date(createExpenseDto.expenseDate),
        dueDate: createExpenseDto.dueDate
          ? new Date(createExpenseDto.dueDate)
          : null,
        status: createExpenseDto.status ?? 'PAID',
        documentId: createExpenseDto.documentId || null,
      },
      include: {
        document: true,
      },
    });
  }

  //  Lấy danh sách chi phí có phân trang, lọc theo danh mục, trạng thái, khoảng ngày
  async findAll(query: FilterExpenseDto) {
    const page = query.page && Number(query.page) > 0 ? Number(query.page) : 1;
    const limit =
      query.limit && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.category) {
      where.category = { contains: query.category.trim(), mode: 'insensitive' };
    }

    if (query.status) {
      where.status = query.status;
    }

    // Lọc theo khoảng ngày phát sinh chi phí
    if (query.fromDate || query.toDate) {
      where.expenseDate = {};
      if (query.fromDate) {
        where.expenseDate.gte = new Date(query.fromDate);
      }
      if (query.toDate) {
        where.expenseDate.lte = new Date(query.toDate);
      }
    }

    // Tìm kiếm tự do theo mô tả hoặc danh mục
    if (query.search && query.search.trim()) {
      const keyword = query.search.trim();
      where.OR = [
        { category: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Thực hiện truy vấn danh sách, đếm tổng số bản ghi và tính tổng tiền
    const [items, total, aggregate] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },

        include: {
          document: {
            select: {
              id: true,
              documentName: true,
              filePath: true,
              fileType: true,
            },
          },
          _count: {
            select: {
              bankReconciliations: true,
            },
          },
        },
      }),

      this.prisma.expense.count({ where }),
      this.prisma.expense.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalAmount: aggregate._sum.amount ?? 0,
    };
  }

  // Xem chi tiết một khoản chi
  async findOne(id: number) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        document: true,
        bankReconciliations: {
          include: {
            transaction: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException(`Không tìm thấy khoản chi phí với ID #${id}`);
    }

    return expense;
  }

  // Cập nhật thông tin khoản chi
  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    // 1. Kiểm tra tồn tại
    await this.findOne(id);

    // 2. Kiểm tra tài liệu chứng từ mới nếu có truyền
    if (updateExpenseDto.documentId) {
      const doc = await this.prisma.document.findUnique({
        where: { id: updateExpenseDto.documentId },
      });
      if (!doc) {
        throw new NotFoundException(
          `Không tìm thấy tài liệu chứng từ với ID #${updateExpenseDto.documentId}`,
        );
      }
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...(updateExpenseDto.category && {
          category: updateExpenseDto.category.trim(),
        }),
        ...(updateExpenseDto.description !== undefined && {
          description: updateExpenseDto.description?.trim() || null,
        }),
        ...(updateExpenseDto.amount !== undefined && {
          amount: updateExpenseDto.amount,
        }),
        ...(updateExpenseDto.expenseDate && {
          expenseDate: new Date(updateExpenseDto.expenseDate),
        }),
        ...(updateExpenseDto.dueDate !== undefined && {
          dueDate: updateExpenseDto.dueDate
            ? new Date(updateExpenseDto.dueDate)
            : null,
        }),
        ...(updateExpenseDto.status && { status: updateExpenseDto.status }),
        ...(updateExpenseDto.documentId !== undefined && {
          documentId: updateExpenseDto.documentId || null,
        }),
      },
      include: {
        document: true,
      },
    });
  }

  // Xóa một khoản chi phí
  async remove(id: number) {
    const expense = await this.findOne(id);

    // Kiểm tra xem khoản chi đã được đối soát ngân hàng chưa
    const hasReconciled = await this.prisma.bankReconciliation.count({
      where: { expenseId: id },
    });

    if (hasReconciled > 0) {
      throw new BadRequestException(
        'Không thể xóa khoản chi phí này vì đã được đối soát với giao dịch sao kê ngân hàng!',
      );
    }

    await this.prisma.expense.delete({ where: { id } });

    return {
      message: `Đã xóa thành công khoản chi phí ID #${id} (${expense.category} - ${Number(expense.amount).toLocaleString('vi-VN')} VND)`,
    };
  }

  // Thống kê chi phí theo danh mục (phục vụ Báo cáo & Dashboard FR-114)
  async getStatistics(year?: number) {
    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const expenses = await this.prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        category: true,
        amount: true,
        status: true,
      },
    });

    // Gom nhóm theo danh mục
    const categoryStats: Record<
      string,
      { totalAmount: number; count: number }
    > = {};
    let totalSpent = 0;

    for (const exp of expenses) {
      const cat = exp.category;
      const amt = Number(exp.amount);
      totalSpent += amt;

      if (!categoryStats[cat]) {
        categoryStats[cat] = { totalAmount: 0, count: 0 };
      }
      categoryStats[cat].totalAmount += amt;
      categoryStats[cat].count += 1;
    }

    return {
      year: currentYear,
      totalSpent,
      totalTransactions: expenses.length,
      categories: Object.entries(categoryStats).map(([name, data]) => ({
        category: name,
        totalAmount: data.totalAmount,
        count: data.count,
        percentage:
          totalSpent > 0
            ? Number(((data.totalAmount / totalSpent) * 100).toFixed(2))
            : 0,
      })),
    };
  }
}
