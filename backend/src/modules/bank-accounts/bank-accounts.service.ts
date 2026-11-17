import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateBankAccountDto } from './dto/create-bank-account.dto.js';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto.js';
import { FilterBankAccountDto } from './dto/filter-bank-account.dto.js';
import { UpdateBankAccountStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class BankAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Thêm tài khoản ngân hàng mới
  async create(createDto: CreateBankAccountDto) {
    return this.prisma.$transaction(async (tx) => {
      // KT sự tồn tại của số tài khoản ngân hàng trước khi thêm mới
      const existing = await tx.bankAccount.findUnique({
        where: { accountNumber: createDto.accountNumber.trim() },
      });

      if (existing) {
        throw new ConflictException(
          `Số tài khoản ${createDto.accountNumber} đã tồn tại trong hệ thống!`,
        );
      }

      // Thêm mới tài khoản ngân hàng
      return tx.bankAccount.create({
        data: {
          bankName: createDto.bankName.trim(),
          accountNumber: createDto.accountNumber.trim(),
          accountHolder: createDto.accountHolder.trim(),
          currency: createDto.currency?.trim() || 'VND',
          status: createDto.status ?? 'ACTIVE',
        },
      });
    });
  }

  // 2. Lấy danh sách tài khoản ngân hàng (có phân trang & lọc)
  async findAll(query: FilterBankAccountDto) {
    const page = query.page && Number(query.page) > 0 ? Number(query.page) : 1; // page
    const limit =
      query.limit && Number(query.limit) > 0 ? Number(query.limit) : 10; // limit
    const skip = (page - 1) * limit; // offset

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const keyword = query.search.trim();
      where.OR = [
        { bankName: { contains: keyword, mode: 'insensitive' } },
        { accountNumber: { contains: keyword, mode: 'insensitive' } },
        { accountHolder: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.bankAccount.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        // số lượng bản ghi sao kê liên quan đến tài khoản ngân hàng
        include: {
          _count: {
            select: { statements: true },
          },
        },
      }),
      this.prisma.bankAccount.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 3. Lấy chi tiết 1 tài khoản ngân hàng
  async findOne(id: number) {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id },
      // số lượng bản ghi sao kê liên quan đến tài khoản ngân hàng
      include: {
        _count: {
          select: { statements: true },
        },
      },
    });

    if (!account) {
      throw new NotFoundException(
        `Không tìm thấy tài khoản ngân hàng với ID #${id}`,
      );
    }

    return account;
  }

  // 4. Cập nhật thông tin tài khoản ngân hàng
  async update(id: number, updateDto: UpdateBankAccountDto) {
    return this.prisma.$transaction(async (tx) => {
      // Kiểm tra tồn tại tài khoản ngân hàng trước khi cập nhật
      const account = await tx.bankAccount.findUnique({
        where: { id },
      });

      if (!account) {
        throw new NotFoundException(
          `Không tìm thấy tài khoản ngân hàng với ID #${id}`,
        );
      }

      // Kiểm tra trùng lặp nếu có đổi số tài khoản
      if (updateDto.accountNumber) {
        const existing = await tx.bankAccount.findUnique({
          where: { accountNumber: updateDto.accountNumber.trim() },
        });

        if (existing && existing.id !== id) {
          throw new ConflictException(
            `Số tài khoản ${updateDto.accountNumber} đã được sử dụng bởi tài khoản khác!`,
          );
        }
      }

      // nếu có truyền các trường cần cập nhật thì mới update, tránh ghi đè dữ liệu không mong muốn
      const data: any = {};
      if (updateDto.bankName !== undefined)
        data.bankName = updateDto.bankName.trim();
      if (updateDto.accountNumber !== undefined)
        data.accountNumber = updateDto.accountNumber.trim();
      if (updateDto.accountHolder !== undefined)
        data.accountHolder = updateDto.accountHolder.trim();
      if (updateDto.currency !== undefined)
        data.currency = updateDto.currency.trim();
      if (updateDto.status !== undefined) data.status = updateDto.status;

      // Cập nhật thông tin tài khoản ngân hàng dựa trên ID tài khoản
      return tx.bankAccount.update({
        where: { id },
        data,
      });
    });
  }

  // 5. Cập nhật trạng thái (Ngừng sử dụng / Kích hoạt lại - AC-47)
  async updateStatus(id: number, statusDto: UpdateBankAccountStatusDto) {
    return this.prisma.$transaction(async (tx) => {
      // Kiểm tra tồn tại tài khoản ngân hàng trước khi cập nhật trạng thái
      const account = await tx.bankAccount.findUnique({
        where: { id },
      });

      if (!account) {
        throw new NotFoundException(
          `Không tìm thấy tài khoản ngân hàng với ID #${id}`,
        );
      }

      return tx.bankAccount.update({
        where: { id },
        data: { status: statusDto.status },
      });
    });
  }

  // 6. Xóa tài khoản ngân hàng (Dùng transaction cô lập kiểm tra và xóa)
  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      // Kiểm tra tồn tại tài khoản ngân hàng trước khi xóa
      const account = await tx.bankAccount.findUnique({
        where: { id },
        // số lượng bản ghi sao kê liên quan đến tài khoản ngân hàng
        include: {
          _count: {
            select: { statements: true },
          },
        },
      });

      if (!account) {
        throw new NotFoundException(
          `Không tìm thấy tài khoản ngân hàng với ID #${id}`,
        );
      }

      // Nếu tài khoản đã có dữ liệu sao kê thì không được xóa vật lý
      if (account._count.statements > 0) {
        throw new BadRequestException(
          `Tài khoản ngân hàng đã có ${account._count.statements} bản ghi sao kê, không thể xóa. Hãy chuyển sang trạng thái Ngừng sử dụng (INACTIVE)!`,
        );
      }

      await tx.bankAccount.delete({
        where: { id },
      });

      return {
        message: `Xóa tài khoản ngân hàng #${id} (${account.bankName} - ${account.accountNumber}) thành công`,
      };
    });
  }
}
