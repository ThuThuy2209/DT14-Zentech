import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterReceivableDto {
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
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId?: number;

  @IsOptional()
  @IsString({ message: 'Trạng thái công nợ phải là chuỗi' })
  @IsIn(['OVERDUE', 'DUE_SOON', 'NOT_DUE', 'PAID', 'ALL'], {
    message: 'Trạng thái công nợ chỉ có thể là: OVERDUE, DUE_SOON, NOT_DUE, PAID, ALL',
  })
  status?: string = 'ALL';

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;
}
