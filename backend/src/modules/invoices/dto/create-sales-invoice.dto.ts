import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalesInvoiceDto {
  @IsNotEmpty({ message: 'customerId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'contractId phải là số nguyên' })
  contractId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'acceptanceId phải là số nguyên' })
  acceptanceId?: number;

  @IsOptional()
  @IsString({ message: 'Mã số hóa đơn phải là chuỗi' })
  @MaxLength(100, { message: 'Mã số hóa đơn tối đa 100 ký tự' })
  invoiceNumber?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày lập hóa đơn không đúng định dạng YYYY-MM-DD' })
  invoiceDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hạn thanh toán không đúng định dạng YYYY-MM-DD' })
  dueDate?: string;

  @IsNotEmpty({ message: 'Tiền trước thuế (subtotal) không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'subtotal phải là số' })
  @Min(0, { message: 'subtotal không được âm' })
  subtotal: number;

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
