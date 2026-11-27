import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateQuoteItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'serviceId phải là số nguyên' })
  serviceId?: number;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Mô tả dịch vụ / hạng mục không được để trống' })
  @IsString({ message: 'Mô tả dịch vụ phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Mô tả hạng mục phải có ít nhất 3 ký tự' })
  @Matches(/^(?=.*[\p{L}]).+$/su, {
    message: 'Mô tả hạng mục báo giá phải chứa chữ cái hợp lệ',
  })
  description: string;

  @IsNotEmpty({ message: 'Số lượng không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @IsPositive({ message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @IsNotEmpty({ message: 'Đơn giá không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  @Min(0, { message: 'Đơn giá không được âm' })
  unitPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Chiết khấu phải là số' })
  @Min(0, { message: 'Chiết khấu không được âm' })
  discountAmount?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Thuế suất VAT phải là số' })
  @Min(0, { message: 'Thuế suất VAT không được âm' })
  @Max(100, { message: 'Thuế suất VAT không được vượt quá 100%' })
  taxRate?: number = 10;
}
