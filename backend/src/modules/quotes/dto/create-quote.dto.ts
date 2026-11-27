import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuoteItemDto } from './create-quote-item.dto.js';

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class CreateQuoteDto {
  @IsNotEmpty({ message: 'customerId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId: number;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã báo giá phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Mã báo giá phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Mã báo giá tối đa 50 ký tự' })
  @Matches(/^[\p{L}\p{N}\-_/]+$/u, {
    message:
      'Mã báo giá chỉ được chứa chữ cái, chữ số và các ký tự -, _, / (không chứa khoảng trắng)',
  })
  quotationCode?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày lập báo giá không đúng định dạng YYYY-MM-DD' })
  createdDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn báo giá không đúng định dạng YYYY-MM-DD' })
  validUntil?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Ghi chú tối đa 500 ký tự' })
  note?: string;

  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'], {
    message: 'Trạng thái không hợp lệ (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED)',
  })
  status?: string = 'DRAFT';

  @ApiProperty({ type: () => [CreateQuoteItemDto], description: 'Danh sách hạng mục báo giá' })
  @IsNotEmpty({ message: 'Danh sách hạng mục báo giá (items) không được để trống' })
  @IsArray({ message: 'items phải là một danh sách' })
  @ArrayMinSize(1, { message: 'Báo giá phải có ít nhất 1 hạng mục dịch vụ' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}
