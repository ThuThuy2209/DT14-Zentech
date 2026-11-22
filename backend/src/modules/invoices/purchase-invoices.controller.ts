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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { PurchaseInvoicesService } from './purchase-invoices.service.js';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto.js';
import { FilterPurchaseInvoiceDto } from './dto/filter-purchase-invoice.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

// Đảm bảo thư mục lưu trữ file upload luôn tồn tại
const uploadDir = path.resolve(process.cwd(), 'uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@ApiTags('Invoices')
@Controller('purchase-invoices')
export class PurchaseInvoicesController {
  constructor(
    private readonly purchaseInvoicesService: PurchaseInvoicesService,
  ) {}

  /**
   * ĐỒNG BỘ 25 HÓA ĐƠN MẪU (NÚT [ĐỒNG BỘ TỪ EMAIL])
   */
  @Post('sync-demo')
  @HttpCode(HttpStatus.OK)
  async syncDemoInvoices(@CurrentUser() user: { id: number }) {
    const data = await this.purchaseInvoicesService.syncDemoInvoices(user?.id);
    return {
      success: true,
      message: data.message,
      data,
    };
  }

  /**
   * TẢI LÊN FILE HÓA ĐƠN (PDF / ẢNH) VÀ AI TỰ ĐỘNG BÓC TÁCH (OCR)
   */
  @ApiOperation({ summary: 'Tải lên file hóa đơn (PDF/Ảnh) để AI bóc tách OCR' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp hóa đơn PDF, JPG, PNG (tối đa 15MB)',
        },
      },
      required: ['file'],
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, uploadDir);
        },
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          const baseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '_');
          cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 15 * 1024 * 1024, // 15MB
      },
    }),
  )
  async uploadInvoice(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.purchaseInvoicesService.uploadInvoice(
      file,
      user?.id,
    );
    return {
      success: true,
      message: 'Tải lên và bóc tách hóa đơn thành công',
      data,
    };
  }

  /**
   * LẤY DANH SÁCH HÓA ĐƠN ĐẦU VÀO (THEO TAB GIAO DIỆN)
   */
  @Get()
  async findAll(@Query() query: FilterPurchaseInvoiceDto) {
    const data = await this.purchaseInvoicesService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách hóa đơn đầu vào thành công',
      data,
    };
  }

  /**
   * XEM CHI TIẾT 1 HÓA ĐƠN ĐẦU VÀO (CHO MÀN HÌNH CHIA ĐÔI SPLIT-VIEW)
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.purchaseInvoicesService.findOne(id);
    return {
      success: true,
      message: 'Lấy chi tiết hóa đơn đầu vào thành công',
      data,
    };
  }

  /**
   * CHỈNH SỬA THÔNG TIN BÓC TÁCH CỦA HÓA ĐƠN
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.purchaseInvoicesService.update(
      id,
      updatePurchaseInvoiceDto,
      user?.id,
    );
    return {
      success: true,
      message: 'Cập nhật thông tin hóa đơn thành công',
      data,
    };
  }

  /**
   * PHÊ DUYỆT / XÁC NHẬN HÓA ĐƠN GHI SỔ
   */
  @Post(':id/confirm')
  async confirm(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.purchaseInvoicesService.confirm(id, user?.id);
    return {
      success: true,
      message: 'Xác nhận hóa đơn hợp lệ thành công',
      data,
    };
  }

  /**
   * TỪ CHỐI HÓA ĐƠN TRÙNG LẶP HOẶC KHÔNG HỢP LỆ
   */
  @ApiOperation({ summary: 'Từ chối hóa đơn đầu vào' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          example: 'Hóa đơn trùng lặp hoặc sai thông tin thuế',
          description: 'Lý do từ chối',
        },
      },
      required: ['reason'],
    },
  })
  @Post(':id/reject')
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.purchaseInvoicesService.reject(
      id,
      reason,
      user?.id,
    );
    return {
      success: true,
      message: 'Đã từ chối hóa đơn',
      data,
    };
  }
}
