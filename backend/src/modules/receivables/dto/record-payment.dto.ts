import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecordPaymentDto {
  @IsNotEmpty({ message: 'salesInvoiceId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'salesInvoiceId phải là số nguyên' })
  salesInvoiceId: number;

  @IsNotEmpty({ message: 'Số tiền thanh toán không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số tiền thanh toán phải là số' })
  @IsPositive({ message: 'Số tiền thanh toán phải lớn hơn 0' })
  amount: number;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày thanh toán không đúng định dạng YYYY-MM-DD' })
  paymentDate?: string;

  @IsOptional()
  @IsString({ message: 'Phương thức thanh toán phải là chuỗi' })
  @IsIn(['BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'OTHER'], {
    message: 'Phương thức thanh toán chỉ có thể là: BANK_TRANSFER, CASH, CREDIT_CARD, OTHER',
  })
  paymentMethod?: string = 'BANK_TRANSFER';

  @IsOptional()
  @IsString({ message: 'Mã tham chiếu ngân hàng phải là chuỗi' })
  transactionReference?: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú thanh toán phải là chuỗi' })
  note?: string;
}
