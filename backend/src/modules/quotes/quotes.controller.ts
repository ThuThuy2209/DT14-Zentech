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
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { FilterQuoteDto } from './dto/filter-quote.dto.js';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  /**
   * FR-29: Lấy danh mục dịch vụ mẫu để chọn nhanh khi tạo báo giá
   */
  @Get('services')
  async getServices() {
    const data = await this.quotesService.getServices();
    return {
      success: true,
      message: 'Lấy danh mục dịch vụ mẫu thành công',
      data,
    };
  }

  /**
   * FR-28, FR-30, FR-31: Tạo báo giá mới kèm các hạng mục dịch vụ
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createQuoteDto: CreateQuoteDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.quotesService.create(createQuoteDto, user?.id);
    return {
      success: true,
      message: 'Tạo báo giá mới thành công',
      data,
    };
  }

  /**
   * Lấy danh sách báo giá (tìm kiếm & phân trang)
   */
  @Get()
  async findAll(@Query() query: FilterQuoteDto) {
    const data = await this.quotesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách báo giá thành công',
      data,
    };
  }

  /**
   * FR-33: Xem chi tiết 1 báo giá theo ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.quotesService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin chi tiết báo giá thành công',
      data,
    };
  }

  /**
   * FR-37: Xem lịch sử chỉnh sửa và gửi báo giá
   */
  @Get(':id/history')
  async getHistory(@Param('id', ParseIntPipe) id: number) {
    const data = await this.quotesService.getHistory(id);
    return {
      success: true,
      message: 'Lấy lịch sử báo giá thành công',
      data,
    };
  }

  /**
   * FR-34: Gửi báo giá cho khách hàng qua email
   */
  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  async sendQuote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.quotesService.sendQuote(id, user?.id);
    return {
      success: true,
      message: `Đã gửi email báo giá thành công tới ${data.recipient}`,
      data,
    };
  }

  /**
   * FR-36 & BR-08, BR-09: Chuyển báo giá thành hợp đồng
   */
  @Post(':id/convert-to-contract')
  @HttpCode(HttpStatus.CREATED)
  async convertToContract(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.quotesService.convertToContract(id, user?.id);
    return {
      success: true,
      message: `Chuyển báo giá thành Hợp đồng ${data.contractCode} thành công!`,
      data,
    };
  }

  /**
   * FR-32: Cập nhật thông tin báo giá
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.quotesService.update(id, updateQuoteDto, user?.id);
    return {
      success: true,
      message: 'Cập nhật báo giá thành công',
      data,
    };
  }

  /**
   * FR-35: Cập nhật trạng thái báo giá (DRAFT -> SENT -> ACCEPTED / REJECTED)
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteStatusDto: UpdateQuoteStatusDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.quotesService.updateStatus(
      id,
      updateQuoteStatusDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Cập nhật trạng thái báo giá thành công',
      data,
    };
  }

  /**
   * Xóa báo giá (chỉ xóa được khi chưa lập Hợp đồng)
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const result = await this.quotesService.remove(id, user?.id);
    return {
      success: true,
      message: result.message,
      data: null,
    };
  }
}
