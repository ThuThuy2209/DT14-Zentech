import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ConfirmReconciliationDto {
  @IsInt({ message: 'ID giao dịch phải là số nguyên' })
  transactionId!: number;

  @IsOptional()
  @IsInt({ message: 'ID hóa đơn bán ra phải là số nguyên' })
  salesInvoiceId?: number;

  @IsOptional()
  @IsInt({ message: 'ID hóa đơn mua vào phải là số nguyên' })
  purchaseInvoiceId?: number;

  @IsOptional()
  @IsInt({ message: 'ID khoản chi phí phải là số nguyên' })
  expenseId?: number;

  @IsNumber({}, { message: 'Số tiền đối chiếu phải là số' })
  @IsPositive({ message: 'Số tiền đối chiếu phải lớn hơn 0' })
  matchedAmount!: number;

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  notes?: string;
}
