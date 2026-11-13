import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterAcceptanceDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang tối thiểu là 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'contractId phải là số nguyên' })
  contractId?: number;

  @IsOptional()
  @IsString({ message: 'Kết quả lọc phải là chuỗi' })
  @IsIn(['PASSED', 'FAILED', 'NEED_FIX'], {
    message: 'Kết quả lọc chỉ có thể là: PASSED, FAILED, NEED_FIX',
  })
  result?: string;

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;
}
