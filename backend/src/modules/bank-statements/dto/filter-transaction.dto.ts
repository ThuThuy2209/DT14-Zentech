import { IsDateString, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterTransactionDto {
  @IsOptional()
  @IsNumberString()
  statementId?: number;

  @IsOptional()
  @IsNumberString()
  accountId?: number;

  @IsOptional()
  @IsIn(['UNRECONCILED', 'RECONCILED', 'PARTIALLY_RECONCILED'])
  reconciliationStatus?: string;

  @IsOptional()
  @IsIn(['IN', 'OUT', 'ALL'], {
    message: 'Loại giao dịch phải là IN (tiền vào), OUT (tiền ra) hoặc ALL',
  })
  type?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
