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
import { ServicesService } from './services.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { UpdateServicePriceDto } from './dto/update-service-price.dto.js';
import { FilterServiceDto } from './dto/filter-service.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * 1. Thêm dịch vụ mới vào danh mục
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createServiceDto: CreateServiceDto) {
    const data = await this.servicesService.create(createServiceDto);
    return {
      success: true,
      message: 'Thêm dịch vụ mới thành công',
      data,
    };
  }

  /**
   * 2. Xem danh sách & Tìm kiếm dịch vụ
   */
  @Get()
  async findAll(@Query() query: FilterServiceDto) {
    const data = await this.servicesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách dịch vụ thành công',
      data,
    };
  }

  /**
   * 3. Xem chi tiết 1 dịch vụ
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.servicesService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin dịch vụ thành công',
      data,
    };
  }

  /**
   * 4. Cập nhật thông tin dịch vụ
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const data = await this.servicesService.update(id, updateServiceDto);
    return {
      success: true,
      message: 'Cập nhật dịch vụ thành công',
      data,
    };
  }

  /**
   * 5. Cập nhật đơn giá dịch vụ
   */
  @Patch(':id/price')
  async updatePrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePriceDto: UpdateServicePriceDto,
  ) {
    const data = await this.servicesService.updatePrice(id, updatePriceDto);
    return {
      success: true,
      message: 'Cập nhật đơn giá dịch vụ thành công',
      data,
    };
  }

  /**
   * 6. Ngừng kinh doanh hoặc kích hoạt lại dịch vụ
   */
  @Patch(':id/status')
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status?: string,
  ) {
    const data = await this.servicesService.toggleStatus(id, status);
    return {
      success: true,
      message:
        data.status === 'INACTIVE'
          ? 'Đã chuyển dịch vụ sang trạng thái Ngừng kinh doanh'
          : 'Đã kích hoạt lại dịch vụ kinh doanh',
      data,
    };
  }

  /**
   * 7. Xóa dịch vụ (tự động xóa mềm nếu đã từng dùng trong báo giá)
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.servicesService.remove(id);
    return {
      success: true,
      message: result.message,
      data: { isSoftDeleted: result.isSoftDeleted },
    };
  }
}
