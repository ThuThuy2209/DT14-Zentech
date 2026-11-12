import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 1. ĐĂNG NHẬP
   */
  async login(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;

    // Tìm kiếm tài khoản theo username hoặc email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tài khoản của bạn hiện đang bị khóa!');
    }

    // So khớp mật khẩu băm
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }

    // Lấy thông tin công ty của chủ doanh nghiệp
    const company = await this.prisma.company.findFirst();

    // Sinh access token (hạn 7 ngày cho app/web)
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
      },
      company: company || null,
    };
  }

  /**
   * 2. LẤY THÔNG TIN TÀI KHOẢN (ME)
   */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Không tìm thấy thông tin tài khoản!');
    }

    const company = await this.prisma.company.findFirst();

    return {
      user,
      company: company || null,
    };
  }

  /**
   * 3. ĐỔI MẬT KHẨU
   */
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng!');
    }

    // Kiểm tra mật khẩu hiện tại có đúng không
    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác!');
    }

    // Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    const isSameAsOld = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSameAsOld) {
      throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
    }

    // Băm mật khẩu mới và cập nhật DB
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.',
    };
  }

  /**
   * 4. XEM THÔNG TIN DOANH NGHIỆP
   */
  async getCompany() {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new NotFoundException('Chưa có thông tin doanh nghiệp trong hệ thống!');
    }
    return company;
  }

  /**
   * 5. CẬP NHẬT THÔNG TIN DOANH NGHIỆP
   */
  async updateCompany(dto: UpdateCompanyDto) {
    let company = await this.prisma.company.findFirst();

    if (!company) {
      // Nếu chưa có thì khởi tạo mới
      company = await this.prisma.company.create({
        data: {
          companyName: dto.companyName || 'Công ty TNHH Một thành viên',
          taxCode: dto.taxCode || '0000000000',
          address: dto.address || null,
          email: dto.email || null,
          phone: dto.phone || null,
          representative: dto.representative || null,
        },
      });
      return company;
    }

    // Cập nhật thông tin công ty hiện có
    return this.prisma.company.update({
      where: { id: company.id },
      data: {
        ...(dto.companyName && { companyName: dto.companyName.trim() }),
        ...(dto.taxCode && { taxCode: dto.taxCode.trim() }),
        ...(dto.address !== undefined && { address: dto.address?.trim() || null }),
        ...(dto.email !== undefined && { email: dto.email?.trim() || null }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
        ...(dto.representative !== undefined && {
          representative: dto.representative?.trim() || null,
        }),
      },
    });
  }

  /**
   * 6. CẤU HÌNH HỆ THỐNG
   */
  async getSystemConfig() {
    return {
      systemName: 'OPC SmartOffice',
      version: '1.0.0',
      description: 'Hệ thống Quản lý Doanh nghiệp Một thành viên (One-Person Company)',
      currency: 'VND',
      fiscalYear: new Date().getFullYear(),
      modules: {
        customers: 'ACTIVE',
        quotes: 'ACTIVE',
        contracts: 'ACTIVE',
        salesInvoices: 'ACTIVE',
        receivables: 'ACTIVE',
        digitalSigningSandbox: 'ENABLED',
      },
    };
  }
}
