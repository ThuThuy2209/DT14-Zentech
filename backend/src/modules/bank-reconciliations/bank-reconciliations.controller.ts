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
  UseGuards,
} from '@nestjs/common';
import { BankReconciliationsService } from './bank-reconciliations.service.js';
import { ConfirmReconciliationDto } from './dto/confirm-reconciliation.dto.js';
import { FilterReconciliationDto } from './dto/filter-reconciliation.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('bank-reconciliations')
export class BankReconciliationsController {
  constructor(private readonly service: BankReconciliationsService) {}

  // 1. Quét tự động danh sách các giao dịch chưa đối chiếu kèm đề xuất tốt nhất
  @Get('auto-match')
  async getAutoMatches() {
    const data = await this.service.getAutoMatches();
    return {
      success: true,
      message: 'Quét tự động và lấy danh sách đề xuất đối chiếu thành công',
      data,
    };
  }

  // 2. Lấy danh sách gợi ý đối chiếu chi tiết cho 1 giao dịch cụ thể
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
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.remove(id);
    return {
      success: true,
      message: data.message,
    };
  }

  // 5. Lấy danh sách lịch sử các lần đối chiếu
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
