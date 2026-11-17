import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BankTransactionsService } from './bank-transactions.service.js';
import { FilterTransactionDto } from './dto/filter-transaction.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('bank-transactions')
export class BankTransactionsController {
  constructor(private readonly service: BankTransactionsService) {}

  // 1. Lấy danh sách giao dịch ngân hàng
  @Get()
  async findAll(@Query() query: FilterTransactionDto) {
    const data = await this.service.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách giao dịch ngân hàng thành công',
      data,
    };
  }

  // 2. Lấy chi tiết 1 giao dịch ngân hàng
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return {
      success: true,
      message: 'Lấy chi tiết giao dịch ngân hàng thành công',
      data,
    };
  }
}
