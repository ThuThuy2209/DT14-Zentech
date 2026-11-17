import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
  @IsString({ message: 'Tên dịch vụ phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên dịch vụ tối đa 255 ký tự' })
  serviceName: string;

  @IsOptional()
  @IsString({ message: 'Mô tả dịch vụ phải là chuỗi ký tự' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Đơn vị tính phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Đơn vị tính tối đa 50 ký tự' })
  unit?: string = 'Gói';

  @IsNotEmpty({ message: 'Đơn giá không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  @Min(0, { message: 'Đơn giá không được âm' })
  unitPrice: number;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái chỉ có thể là ACTIVE hoặc INACTIVE',
  })
  status?: string = 'ACTIVE';
}
