import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

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

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã tham chiếu ngân hàng phải là chuỗi' })
  @MinLength(3, { message: 'Mã tham chiếu ngân hàng phải có ít nhất 3 ký tự' })
  @MaxLength(100, { message: 'Mã tham chiếu ngân hàng tối đa 100 ký tự' })
  @Matches(/^[A-Za-z0-9\-_/]+$/, {
    message:
      'Mã tham chiếu ngân hàng chỉ được chứa chữ cái không dấu, chữ số và các ký tự -, _, /',
  })
  transactionReference?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Ghi chú thanh toán phải là chuỗi' })
  @MaxLength(500, { message: 'Ghi chú thanh toán tối đa 500 ký tự' })
  note?: string;
}
