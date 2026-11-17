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

export class CreatePurchaseInvoiceDto {
  @IsNotEmpty({ message: 'Tên nhà cung cấp (người bán) không được để trống' })
  @IsString({ message: 'Tên nhà cung cấp phải là chuỗi' })
  @MaxLength(200, { message: 'Tên nhà cung cấp tối đa 200 ký tự' })
  supplierName: string;

  @IsOptional()
  @IsString({ message: 'Số hóa đơn phải là chuỗi' })
  @MaxLength(100, { message: 'Số hóa đơn tối đa 100 ký tự' })
  invoiceNumber?: string;

  @IsOptional()
  @IsString({ message: 'Mã số thuế người bán phải là chuỗi' })
  @MaxLength(50, { message: 'Mã số thuế người bán tối đa 50 ký tự' })
  sellerTaxCode?: string;

  @IsOptional()
  @IsString({ message: 'Mã số thuế người mua phải là chuỗi' })
  @MaxLength(50, { message: 'Mã số thuế người mua tối đa 50 ký tự' })
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
