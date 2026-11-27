import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateServiceDto {
  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
  @IsString({ message: 'Tên dịch vụ phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên dịch vụ phải có ít nhất 3 ký tự' })
  @MaxLength(255, { message: 'Tên dịch vụ tối đa 255 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/,:_]+$/u, {
    message:
      'Tên dịch vụ không hợp lệ (phải có chữ cái và không chứa ký tự đặc biệt lạ)',
  })
  serviceName: string;

  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Mô tả dịch vụ phải là chuỗi ký tự' })
  description?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Đơn vị tính phải là chuỗi ký tự' })
  @MinLength(1, { message: 'Đơn vị tính không được để trống' })
  @MaxLength(50, { message: 'Đơn vị tính tối đa 50 ký tự' })
  @Matches(/^[\p{L}\p{N}\s/]+$/u, {
    message: 'Đơn vị tính không được chứa ký tự đặc biệt',
  })
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
