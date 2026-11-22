import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankAccountsService } from '../services/bank-accounts.service.js';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto.js';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto.js';
import { FilterBankAccountDto } from '../dto/filter-bank-account.dto.js';
import { UpdateBankAccountStatusDto } from '../dto/update-status.dto.js';

@ApiTags('Bank Accounts')
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  // 1. Thêm tài khoản ngân hàng mới
  @ApiOperation({ summary: 'Thêm tài khoản ngân hàng mới' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateBankAccountDto) {
    const data = await this.bankAccountsService.create(createDto);
    return {
      success: true,
      message: 'Thêm tài khoản ngân hàng mới thành công',
      data,
    };
  }

  // 2. Lấy danh sách tài khoản ngân hàng (hỗ trợ phân trang, tìm kiếm, lọc status)
  @ApiOperation({ summary: 'Lấy danh sách tài khoản ngân hàng' })
  @Get()
  async findAll(@Query() query: FilterBankAccountDto) {
    const data = await this.bankAccountsService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách tài khoản ngân hàng thành công',
      data,
    };
  }

  // 3. Lấy chi tiết tài khoản ngân hàng
  // ParseIntPipe chuyển đổi dữ liệu đầu vào từ chuỗi (string) sang số nguyên (integer)
  @ApiOperation({ summary: 'Lấy chi tiết tài khoản ngân hàng' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bankAccountsService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin tài khoản ngân hàng thành công',
      data,
    };
  }

  // 4. Cập nhật thông tin tài khoản ngân hàng
  // ParseIntPipe chuyển đổi dữ liệu đầu vào từ chuỗi (string) sang số nguyên (integer)
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản ngân hàng' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBankAccountDto,
  ) {
    const data = await this.bankAccountsService.update(id, updateDto);
    return {
      success: true,
      message: 'Cập nhật tài khoản ngân hàng thành công',
      data,
    };
  }

  // 5. Ngừng sử dụng hoặc kích hoạt lại tài khoản ngân hàng (AC-47)
  @ApiOperation({ summary: 'Cập nhật trạng thái tài khoản ngân hàng' })
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateBankAccountStatusDto,
  ) {
    const data = await this.bankAccountsService.updateStatus(id, statusDto);
    return {
      success: true,
      message: `Cập nhật trạng thái tài khoản thành ${statusDto.status} thành công`,
      data,
    };
  }

  // 6. Xóa tài khoản ngân hàng (chỉ khi chưa có sao kê)
  @ApiOperation({ summary: 'Xóa tài khoản ngân hàng' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bankAccountsService.remove(id);
    return {
      success: true,
      message: data.message,
    };
  }
}
