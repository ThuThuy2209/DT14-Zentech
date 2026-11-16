import { IsDateString, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSalesInvoiceDto {
  @IsOptional()
  @IsDateString({}, { message: 'Ngày lập hóa đơn không đúng định dạng YYYY-MM-DD' })
  invoiceDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hạn thanh toán không đúng định dạng YYYY-MM-DD' })
  dueDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'subtotal phải là số' })
  @Min(0, { message: 'subtotal không được âm' })
  subtotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'taxAmount phải là số' })
  @Min(0, { message: 'taxAmount không được âm' })
  taxAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'totalAmount phải là số' })
  @Min(0, { message: 'totalAmount không được âm' })
  totalAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'documentId phải là số nguyên' })
  documentId?: number;
}
