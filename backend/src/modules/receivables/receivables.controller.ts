import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReceivablesService } from './receivables.service.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { FilterReceivableDto } from './dto/filter-receivable.dto.js';
import { CreateReminderDraftDto } from './dto/create-reminder-draft.dto.js';
import { ApproveReminderDto } from './dto/approve-reminder.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Receivables')
@Controller('receivables')
export class ReceivablesController {
  constructor(private readonly receivablesService: ReceivablesService) {}

  /**
   * TỔNG HỢP CÔNG NỢ TOÀN DOANH NGHIỆP (FR-73, FR-76)
   */
  @ApiOperation({ summary: 'Tổng hợp công nợ toàn doanh nghiệp' })
  @Get('summary')
  async getSummary() {
    const data = await this.receivablesService.getSummary();
    return {
      success: true,
      message: 'Lấy báo cáo tổng hợp công nợ thành công',
      data,
    };
  }

  /**
   * GHI NHẬN THANH TOÁN CHO HÓA ĐƠN BÁN RA (FR-72)
   */
  @ApiOperation({ summary: 'Ghi nhận thanh toán cho hóa đơn bán ra' })
  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async recordPayment(
    @Body() recordPaymentDto: RecordPaymentDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.receivablesService.recordPayment(
      recordPaymentDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Ghi nhận thanh toán thành công',
      data,
    };
  }

  /**
   * DANH SÁCH & THEO DÕI CÔNG NỢ CHI TIẾT (FR-73, FR-74, FR-75)
   */
  @ApiOperation({ summary: 'Danh sách & theo dõi công nợ chi tiết' })
  @Get()
  async findAll(@Query() query: FilterReceivableDto) {
    const data = await this.receivablesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách công nợ thành công',
      data,
    };
  }

  /**
   * AI SOẠN EMAIL NHẮC NỢ (BẢN NHÁP CHO CHỦ DOANH NGHIỆP) (FR-77)
   */
  @ApiOperation({ summary: 'AI soạn nháp email nhắc nợ' })
  @Post(':invoiceId/remind-draft')
  @HttpCode(HttpStatus.CREATED)
  async createReminderDraft(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Body() dto: CreateReminderDraftDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.receivablesService.createReminderDraft(
      invoiceId,
      dto,
      user?.id,
    );
    return {
      success: true,
      message: 'AI soạn nháp email nhắc nợ thành công',
      data,
    };
  }

  /**
   * CHỦ DOANH NGHIỆP DUYỆT & GỬI EMAIL NHẮC NỢ (FR-78, FR-79, FR-80)
   */
  @ApiOperation({ summary: 'Chủ doanh nghiệp duyệt & gửi email nhắc nợ' })
  @Post('remind-approve/:approvalId')
  async approveReminder(
    @Param('approvalId', ParseIntPipe) approvalId: number,
    @Body() dto: ApproveReminderDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.receivablesService.approveReminder(
      approvalId,
      dto,
      user?.id,
    );
    return {
      success: true,
      message: data.message,
      data: data.approval,
    };
  }

  /**
   * LỊCH SỬ NHẮC NỢ CỦA HÓA ĐƠN (FR-80)
   */
  @ApiOperation({ summary: 'Xem lịch sử nhắc nợ của hóa đơn' })
  @Get(':invoiceId/reminder-history')
  async getReminderHistory(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    const data = await this.receivablesService.getReminderHistory(invoiceId);
    return {
      success: true,
      message: 'Lấy lịch sử nhắc nợ thành công',
      data,
    };
  }

  /**
   * XEM CHI TIẾT CÔNG NỢ 1 HÓA ĐƠN
   */
  @ApiOperation({ summary: 'Xem chi tiết công nợ 1 hóa đơn' })
  @Get(':invoiceId')
  async findOne(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    const data = await this.receivablesService.findOne(invoiceId);
    return {
      success: true,
      message: 'Lấy thông tin công nợ chi tiết thành công',
      data,
    };
  }
}
