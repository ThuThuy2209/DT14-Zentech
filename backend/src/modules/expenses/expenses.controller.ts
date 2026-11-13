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
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { FilterExpenseDto } from './dto/filter-expense.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    const data = await this.expensesService.create(createExpenseDto);
    return {
      success: true,
      message: 'Ghi nhận khoản chi phí thành công',
      data,
    };
  }

  @Get('statistics')
  async getStatistics(@Query('year') year?: string) {
    const parsedYear = year ? parseInt(year, 10) : undefined;
    const data = await this.expensesService.getStatistics(parsedYear);
    return {
      success: true,
      message: 'Lấy thống kê chi phí thành công',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: FilterExpenseDto) {
    const data = await this.expensesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách chi phí thành công',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.expensesService.findOne(id);
    return {
      success: true,
      message: 'Lấy chi tiết khoản chi phí thành công',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const data = await this.expensesService.update(id, updateExpenseDto);
    return {
      success: true,
      message: 'Cập nhật khoản chi phí thành công',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.expensesService.remove(id);
    return {
      success: true,
      message: data.message,
    };
  }
}
