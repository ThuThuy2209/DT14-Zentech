import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterContractDto {
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId?: number;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'DRAFT',
      'PENDING_SIGN',
      'SIGNING',
      'SIGNED',
      'REJECTED',
      'EXPIRED',
      'TERMINATED',
    ],
    {
      message:
        'Trạng thái lọc chỉ có thể là: DRAFT, PENDING_SIGN, SIGNING, SIGNED, REJECTED, EXPIRED, TERMINATED',
    },
  )
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang bắt đầu từ 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  @Max(100, { message: 'Số lượng tối đa mỗi trang là 100' })
  limit?: number = 10;
}
