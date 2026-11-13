import {
  Body,
  Controller,
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
import { SalesInvoicesService } from './sales-invoices.service.js';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto.js';
import { UpdateSalesInvoiceDto } from './dto/update-sales-invoice.dto.js';
import { FilterSalesInvoiceDto } from './dto/filter-sales-invoice.dto.js';
import { CreateFromAcceptanceDto } from './dto/create-from-acceptance.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('sales-invoices')
export class SalesInvoicesController {
  constructor(private readonly salesInvoicesService: SalesInvoicesService) {}

  /**
   * LẬP HÓA ĐƠN BÁN RA MỚI (FR-65)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSalesInvoiceDto: CreateSalesInvoiceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.salesInvoicesService.create(
      createSalesInvoiceDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Lập hóa đơn bán ra thành công',
      data,
    };
  }

  /**
   * XUẤT HÓA ĐƠN BÁN RA TỪ BIÊN BẢN NGHIỆM THU ĐẠT (FR-66, FR-67)
   */
  @Post('from-acceptance/:acceptanceId')
  @HttpCode(HttpStatus.CREATED)
  async createFromAcceptance(
    @Param('acceptanceId', ParseIntPipe) acceptanceId: number,
    @Body() dto: CreateFromAcceptanceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.salesInvoicesService.createFromAcceptance(
      acceptanceId,
      dto,
      user?.id,
    );
    return {
      success: true,
      message: 'Xuất hóa đơn từ biên bản nghiệm thu thành công',
      data,
    };
  }

  /**
   * TRA CỨU & DANH SÁCH HÓA ĐƠN BÁN RA (FR-70)
   */
  @Get()
  async findAll(@Query() query: FilterSalesInvoiceDto) {
    const data = await this.salesInvoicesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách hóa đơn bán ra thành công',
      data,
    };
  }

  /**
   * XEM CHI TIẾT 1 HÓA ĐƠN BÁN RA (FR-70, FR-71)
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.salesInvoicesService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin chi tiết hóa đơn bán ra thành công',
      data,
    };
  }

  /**
   * CẬP NHẬT HÓA ĐƠN BÁN RA (KHI CÒN LÀ DRAFT)
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalesInvoiceDto: UpdateSalesInvoiceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.salesInvoicesService.update(
      id,
      updateSalesInvoiceDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Cập nhật thông tin hóa đơn bán ra thành công',
      data,
    };
  }

  /**
   * PHÁT HÀNH CHÍNH THỨC HÓA ĐƠN BÁN RA (FR-69)
   */
  @Post(':id/issue')
  async issue(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.salesInvoicesService.issue(id, user?.id);
    return {
      success: true,
      message: 'Phát hành chính thức hóa đơn thành công',
      data,
    };
  }

  /**
   * HỦY HÓA ĐƠN BÁN RA (FR-69)
   */
  @Post(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.salesInvoicesService.cancel(id, reason, user?.id);
    return {
      success: true,
      message: 'Hủy hóa đơn bán ra thành công',
      data,
    };
  }
}
