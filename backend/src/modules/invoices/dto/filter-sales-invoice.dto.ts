import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterSalesInvoiceDto {
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
  @Type(() => Number)
  @IsInt({ message: 'contractId phải là số nguyên' })
  contractId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'acceptanceId phải là số nguyên' })
  acceptanceId?: number;

  @IsOptional()
  @IsString({ message: 'invoiceStatus phải là chuỗi' })
  @IsIn(['DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'], {
    message: 'invoiceStatus chỉ có thể là: DRAFT, ISSUED, PARTIALLY_PAID, PAID, CANCELLED',
  })
  invoiceStatus?: string;

  @IsOptional()
  @IsString({ message: 'paymentStatus phải là chuỗi' })
  @IsIn(['UNPAID', 'PARTIALLY_PAID', 'PAID'], {
    message: 'paymentStatus chỉ có thể là: UNPAID, PARTIALLY_PAID, PAID',
  })
  paymentStatus?: string;

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;
}
