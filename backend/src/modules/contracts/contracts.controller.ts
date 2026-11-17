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
import { ContractsService } from './contracts.service.js';
import { CreateContractDto } from './dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto.js';
import { FilterContractDto } from './dto/filter-contract.dto.js';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { AddSignerDto } from './dto/add-signer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  // 1. MẪU HỢP ĐỒNG (TEMPLATES)

  /**
   * Lấy danh sách mẫu hợp đồng & phiên bản mẫu
   */
  @Get('templates')
  async getTemplates() {
    const data = await this.contractsService.getTemplates();
    return {
      success: true,
      message: 'Lấy danh sách mẫu hợp đồng thành công',
      data,
    };
  }

  /**
   * Tạo mới mẫu hợp đồng kèm phiên bản 1
   */
  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    const data = await this.contractsService.createTemplate(createTemplateDto);
    return {
      success: true,
      message: 'Tạo mẫu hợp đồng mới thành công',
      data,
    };
  }

  // 2. HỢP ĐỒNG (CONTRACTS)

  /**
   * Tạo hợp đồng mới (từ mẫu hoặc nhập trực tiếp)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createContractDto: CreateContractDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.contractsService.create(createContractDto, user?.id);
    return {
      success: true,
      message: 'Tạo hợp đồng mới thành công',
      data,
    };
  }

  /**
   * Xem danh sách hợp đồng (tìm kiếm & phân trang)
   */
  @Get()
  async findAll(@Query() query: FilterContractDto) {
    const data = await this.contractsService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách hợp đồng thành công',
      data,
    };
  }

  /**
   * Xem chi tiết 1 hợp đồng
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.contractsService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin chi tiết hợp đồng thành công',
      data,
    };
  }

  /**
   * Cập nhật thông tin hợp đồng (khi chưa ký)
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractDto: UpdateContractDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.contractsService.update(
      id,
      updateContractDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Cập nhật hợp đồng thành công',
      data,
    };
  }

  /**
   * Xóa hợp đồng
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const result = await this.contractsService.remove(id, user?.id);
    return {
      success: true,
      message: result.message,
      data: null,
    };
  }

  // 3. NGƯỜI KÝ HỢP ĐỒNG (SIGNERS)

  /**
   * Thêm người ký vào hợp đồng
   */
  @Post(':id/signers')
  @HttpCode(HttpStatus.CREATED)
  async addSigner(
    @Param('id', ParseIntPipe) id: number,
    @Body() addSignerDto: AddSignerDto,
  ) {
    const data = await this.contractsService.addSigner(id, addSignerDto);
    return {
      success: true,
      message: 'Thêm người ký vào hợp đồng thành công',
      data,
    };
  }

  /**
   * Lấy danh sách người ký của hợp đồng
   */
  @Get(':id/signers')
  async getSigners(@Param('id', ParseIntPipe) id: number) {
    const data = await this.contractsService.getSigners(id);
    return {
      success: true,
      message: 'Lấy danh sách người ký thành công',
      data,
    };
  }

  // 4. KÝ SỐ SANDBOX (SANDBOX SIGNING)
  /**
   * Gửi hợp đồng đến cổng ký số Sandbox & mô phỏng ký số hoàn tất
   */
  @Post(':id/sign-sandbox')
  @HttpCode(HttpStatus.OK)
  async sendToSandboxSign(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.contractsService.sendToSandboxSign(id, user?.id);
    return {
      success: true,
      message: data.message,
      data,
    };
  }

  /**
   * Xem tiến trình & lịch sử sự kiện ký số Sandbox
   */
  @Get(':id/signing-status')
  async getSigningStatus(@Param('id', ParseIntPipe) id: number) {
    const data = await this.contractsService.getSigningStatus(id);
    return {
      success: true,
      message: 'Lấy trạng thái ký số Sandbox thành công',
      data,
    };
  }
}
