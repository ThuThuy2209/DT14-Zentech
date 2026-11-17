import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuoteItemDto } from './create-quote-item.dto.js';

export class CreateQuoteDto {
  @IsNotEmpty({ message: 'customerId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId: number;

  @IsOptional()
  @IsString({ message: 'Mã báo giá phải là chuỗi ký tự' })
  quotationCode?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày lập báo giá không đúng định dạng YYYY-MM-DD' })
  createdDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn báo giá không đúng định dạng YYYY-MM-DD' })
  validUntil?: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  note?: string;

  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'], {
    message: 'Trạng thái không hợp lệ (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED)',
  })
  status?: string = 'DRAFT';

  @IsNotEmpty({ message: 'Danh sách hạng mục báo giá (items) không được để trống' })
  @IsArray({ message: 'items phải là một danh sách' })
  @ArrayMinSize(1, { message: 'Báo giá phải có ít nhất 1 hạng mục dịch vụ' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}
