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

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class CreatePurchaseInvoiceDto {
  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên nhà cung cấp (người bán) không được để trống' })
  @IsString({ message: 'Tên nhà cung cấp phải là chuỗi' })
  @MinLength(3, { message: 'Tên nhà cung cấp phải có ít nhất 3 ký tự' })
  @MaxLength(200, { message: 'Tên nhà cung cấp tối đa 200 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/]+$/u, {
    message:
      'Tên nhà cung cấp không hợp lệ (phải có chữ cái, không chứa dấu phẩy hoặc ký tự đặc biệt lạ)',
  })
  supplierName: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Số hóa đơn phải là chuỗi' })
  @MinLength(2, { message: 'Số hóa đơn phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Số hóa đơn tối đa 100 ký tự' })
  @Matches(/^[A-Za-z0-9\-_/]+$/, {
    message:
      'Số hóa đơn chỉ được chứa chữ cái không dấu, chữ số và các ký tự -, _, /',
  })
  invoiceNumber?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã số thuế người bán phải là chuỗi' })
  @Matches(/^\d{10}(-\d{3})?$/, {
    message:
      'Mã số thuế người bán không hợp lệ (phải gồm 10 chữ số hoặc 13 chữ số dạng 0123456789-001)',
  })
  sellerTaxCode?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã số thuế người mua phải là chuỗi' })
  @Matches(/^\d{10}(-\d{3})?$/, {
    message:
      'Mã số thuế người mua không hợp lệ (phải gồm 10 chữ số hoặc 13 chữ số dạng 0123456789-001)',
  })
  buyerTaxCode?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày lập hóa đơn không đúng định dạng YYYY-MM-DD' })
  invoiceDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hạn thanh toán không đúng định dạng YYYY-MM-DD' })
  dueDate?: string;

  @IsNotEmpty({ message: 'Tổng tiền thanh toán không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Tổng tiền thanh toán phải là số' })
  @Min(0, { message: 'Tổng tiền thanh toán không được âm' })
  totalAmount: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'documentId phải là số nguyên' })
  documentId?: number;
}
