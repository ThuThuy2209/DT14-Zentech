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
import { AcceptanceService } from './acceptance.service.js';
import { CreateAcceptanceDto } from './dto/create-acceptance.dto.js';
import { UpdateAcceptanceDto } from './dto/update-acceptance.dto.js';
import { FilterAcceptanceDto } from './dto/filter-acceptance.dto.js';
import { AttachEvidenceDto } from './dto/attach-evidence.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('acceptances')
export class AcceptanceController {
  constructor(private readonly acceptanceService: AcceptanceService) {}

  /**
   * Xem danh sách tất cả hồ sơ nghiệm thu (Phân trang, tìm kiếm, lọc)
   */
  @Get()
  async findAll(@Query() query: FilterAcceptanceDto) {
    const data = await this.acceptanceService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách hồ sơ nghiệm thu thành công',
      data,
    };
  }

  /**
   * Xem chi tiết 1 hồ sơ nghiệm thu
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.acceptanceService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin chi tiết hồ sơ nghiệm thu thành công',
      data,
    };
  }

  /**
   * Tạo mới hồ sơ nghiệm thu
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAcceptanceDto: CreateAcceptanceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.acceptanceService.create(createAcceptanceDto, user?.id);
    return {
      success: true,
      message: 'Tạo hồ sơ nghiệm thu thành công',
      data,
    };
  }

  /**
   * Cập nhật hồ sơ nghiệm thu (nội dung, kết quả, vấn đề cần khắc phục...)
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAcceptanceDto: UpdateAcceptanceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.acceptanceService.update(
      id,
      updateAcceptanceDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Cập nhật hồ sơ nghiệm thu thành công',
      data,
    };
  }

  /**
   * Đính kèm tài liệu minh chứng vào hồ sơ nghiệm thu
   */
  @Post(':id/evidence')
  async attachEvidence(
    @Param('id', ParseIntPipe) id: number,
    @Body() attachEvidenceDto: AttachEvidenceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.acceptanceService.attachEvidence(
      id,
      attachEvidenceDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Đính kèm tài liệu minh chứng thành công',
      data,
    };
  }
}
