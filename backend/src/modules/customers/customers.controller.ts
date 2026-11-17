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
import { CustomersService } from './customers.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { FilterCustomerDto } from './dto/filter-customer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const data = await this.customersService.create(createCustomerDto);
    return {
      success: true,
      message: 'Tạo khách hàng mới thành công',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: FilterCustomerDto) {
    const data = await this.customersService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách khách hàng thành công',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.customersService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin chi tiết khách hàng thành công',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const data = await this.customersService.update(id, updateCustomerDto);
    return {
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.customersService.remove(id);
    return {
      success: true,
      message: result.message,
      data: { isSoftDeleted: result.isSoftDeleted },
    };
  }
}
