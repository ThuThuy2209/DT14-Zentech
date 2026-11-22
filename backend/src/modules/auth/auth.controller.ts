import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1. Đăng nhập (Chủ doanh nghiệp)
   */
  @ApiOperation({ summary: 'Đăng nhập' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Đăng nhập thành công',
      data,
    };
  }

  /**
   * 2. Đăng xuất
   */
  @ApiOperation({ summary: 'Đăng xuất' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return {
      success: true,
      message: 'Đăng xuất thành công',
      data: null,
    };
  }

  /**
   * 3. Lấy thông tin tài khoản hiện tại
   */
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  @Get('me')
  async getProfile(@CurrentUser() user: { id: number }) {
    const data = await this.authService.getProfile(user.id);
    return {
      success: true,
      message: 'Lấy thông tin tài khoản thành công',
      data,
    };
  }

  /**
   * 4. Đổi mật khẩu
   */
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: { id: number },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const data = await this.authService.changePassword(user.id, changePasswordDto);
    return {
      success: true,
      message: data.message,
      data: null,
    };
  }

  /**
   * 5. Xem thông tin doanh nghiệp
   */
  @ApiOperation({ summary: 'Xem thông tin doanh nghiệp' })
  @Get('company')
  async getCompany() {
    const data = await this.authService.getCompany();
    return {
      success: true,
      message: 'Lấy thông tin doanh nghiệp thành công',
      data,
    };
  }

  /**
   * 6. Cập nhật thông tin doanh nghiệp
   */
  @ApiOperation({ summary: 'Cập nhật thông tin doanh nghiệp' })
  @Patch('company')
  async updateCompany(@Body() updateCompanyDto: UpdateCompanyDto) {
    const data = await this.authService.updateCompany(updateCompanyDto);
    return {
      success: true,
      message: 'Cập nhật thông tin doanh nghiệp thành công',
      data,
    };
  }

  /**
   * 7. Cấu hình hệ thống
   */
  @ApiOperation({ summary: 'Xem cấu hình hệ thống' })
  @Get('system-config')
  async getSystemConfig() {
    const data = await this.authService.getSystemConfig();
    return {
      success: true,
      message: 'Lấy cấu hình hệ thống thành công',
      data,
    };
  }
}
