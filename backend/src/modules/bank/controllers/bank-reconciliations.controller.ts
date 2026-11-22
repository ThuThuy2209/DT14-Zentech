import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankReconciliationsService } from '../services/bank-reconciliations.service.js';
import { ConfirmReconciliationDto } from '../dto/confirm-reconciliation.dto.js';
import { FilterReconciliationDto } from '../dto/filter-reconciliation.dto.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';

@ApiTags('Bank Reconciliations')
@Controller('bank-reconciliations')
export class BankReconciliationsController {
  constructor(private readonly service: BankReconciliationsService) {}

  // 1. Quét tự động tất cả giao dịch với hóa đơn bán ra, mua vào, khoản thu chi
  @ApiOperation({ summary: 'Quét tự động và đề xuất đối chiếu giao dịch' })
  @Get('auto-match')
  async getAutoMatches() {
    const data = await this.service.getAutoMatches();
    return {
      success: true,
      message: 'Quét tự động và lấy danh sách đề xuất đối chiếu thành công',
      data,
    };
  }

  // 2. Lấy danh sách gợi ý đối chiếu chi tiết cho 1 giao dịch
  @ApiOperation({ summary: 'Lấy danh sách gợi ý đối chiếu cho 1 giao dịch' })
  @Get('suggest/:transactionId')
  async getSuggestions(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ) {
    const data = await this.service.getSuggestions(transactionId);
    return {
      success: true,
      message: 'Lấy danh sách gợi ý đối chiếu thành công',
      data,
    };
  }

  // 3. Xác nhận đối chiếu (Gạch nợ hóa đơn, tạo payment, cập nhật trạng thái)
  @ApiOperation({ summary: 'Xác nhận đối chiếu (gạch nợ, tạo payment)' })
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(
    @Body() dto: ConfirmReconciliationDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.service.confirm(dto, user?.id);
    return {
      success: true,
      message: data.message,
      data: data.reconciliation,
    };
  }

  // 4. Hủy kết quả đối chiếu (Rollback số tiền công nợ)
  @ApiOperation({ summary: 'Hủy kết quả đối chiếu (rollback)' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.remove(id);
    return {
      success: true,
      message: data.message,
    };
  }

  // 5. Lấy danh sách lịch sử các lần đối chiếu
  @ApiOperation({ summary: 'Lấy danh sách lịch sử đối chiếu' })
  @Get()
  async findAll(@Query() query: FilterReconciliationDto) {
    const data = await this.service.findAll(query);
    return {
      success: true,
      message: 'Lấy lịch sử đối chiếu thành công',
      data,
    };
  }
}
