import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuoteItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'serviceId phải là số nguyên' })
  serviceId?: number;

  @IsNotEmpty({ message: 'Mô tả dịch vụ / hạng mục không được để trống' })
  @IsString({ message: 'Mô tả dịch vụ phải là chuỗi ký tự' })
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
  taxRate?: number = 10;
}
