import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPurchaseInvoiceDto {
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
  @IsString({ message: 'Tab phải là chuỗi' })
  @IsIn(['ALL', 'NEEDS_REVIEW', 'VALID', 'REJECTED'], {
    message: 'Tab chỉ có thể là: ALL, NEEDS_REVIEW, VALID, REJECTED',
  })
  tab?: string = 'ALL';

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'Trạng thái trùng lặp phải là chuỗi' })
  duplicateStatus?: string;

  @IsOptional()
  @IsString({ message: 'Trạng thái mã số thuế phải là chuỗi' })
  buyerTaxStatus?: string;
}
