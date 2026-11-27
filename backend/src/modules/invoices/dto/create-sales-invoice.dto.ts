import {
  IsDateString,
  IsInt,
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

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

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

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã số hóa đơn phải là chuỗi' })
  @MinLength(2, { message: 'Mã số hóa đơn phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Mã số hóa đơn tối đa 100 ký tự' })
  @Matches(/^[A-Za-z0-9\-_/]+$/, {
    message:
      'Mã số hóa đơn chỉ được chứa chữ cái không dấu, chữ số và các ký tự -, _, /',
  })
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
