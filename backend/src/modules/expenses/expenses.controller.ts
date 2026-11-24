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
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { FilterExpenseDto } from './dto/filter-expense.dto.js';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiOperation({ summary: 'Ghi nhận khoản chi phí mới' })
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

  @ApiOperation({ summary: 'Lấy thống kê chi phí' })
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

  @ApiOperation({ summary: 'Lấy danh sách chi phí (có lọc & phân trang)' })
  @Get()
  async findAll(@Query() query: FilterExpenseDto) {
    const data = await this.expensesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách chi phí thành công',
      data,
    };
  }

  @ApiOperation({ summary: 'Lấy chi tiết khoản chi phí' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.expensesService.findOne(id);
    return {
      success: true,
      message: 'Lấy chi tiết khoản chi phí thành công',
      data,
    };
  }

  @ApiOperation({ summary: 'Cập nhật khoản chi phí' })
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

  @ApiOperation({ summary: 'Xóa khoản chi phí' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.expensesService.remove(id);
    return {
      success: true,
      message: data.message,
    };
  }
}
