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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankStatementsService } from '../services/bank-statements.service.js';
import { UploadStatementDto } from '../dto/upload-statement.dto.js';
import { FilterStatementDto } from '../dto/filter-statement.dto.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';

@ApiTags('Bank Statements')
@Controller('bank-statements')
export class BankStatementsController {
  constructor(private readonly bankStatementsService: BankStatementsService) {}

  // 1. Upload file sao kê ngân hàng (Excel hoặc CSV)
  @ApiOperation({ summary: 'Upload file sao kê ngân hàng (Excel/CSV)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp sao kê định dạng .xlsx, .xls hoặc .csv',
        },
        accountId: {
          type: 'string',
          example: '1',
          description: 'ID tài khoản ngân hàng',
        },
      },
      required: ['file', 'accountId'],
    },
  })
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file')) // multer đọc file, validate (nếu có), lưu vào req.file
  async uploadStatement(
    @UploadedFile() file: any, // lấy file từ req.file
    @Body() uploadDto: UploadStatementDto,
    @CurrentUser() user: { id: number },
  ) {
    const data = await this.bankStatementsService.uploadStatement(
      file,
      parseInt(uploadDto.accountId, 10),
      user?.id,
    );
    return {
      success: true,
      message: 'Nhập tệp sao kê ngân hàng và bóc tách dữ liệu thành công',
      data,
    };
  }

  // 2. Lấy danh sách các đợt sao kê đã upload
  @ApiOperation({ summary: 'Lấy danh sách các đợt sao kê đã upload' })
  @Get()
  async findAllStatements(@Query() query: FilterStatementDto) {
    const data = await this.bankStatementsService.findAllStatements(query);
    return {
      success: true,
      message: 'Lấy danh sách các đợt sao kê thành công',
      data,
    };
  }

  // 3. Lấy chi tiết 1 đợt sao kê
  @ApiOperation({ summary: 'Lấy chi tiết 1 đợt sao kê' })
  @Get(':id')
  async findOneStatement(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bankStatementsService.findOneStatement(id);
    return {
      success: true,
      message: 'Lấy thông tin đợt sao kê thành công',
      data,
    };
  }

  // 4. Xóa 1 đợt sao kê (chỉ khi chưa có giao dịch đối chiếu)
  @ApiOperation({ summary: 'Xóa 1 đợt sao kê' })
  @Delete(':id')
  async removeStatement(@Param('id', ParseIntPipe) id: number) {
    const data = await this.bankStatementsService.removeStatement(id);
    return {
      success: true,
      message: data.message,
    };
  }
}
