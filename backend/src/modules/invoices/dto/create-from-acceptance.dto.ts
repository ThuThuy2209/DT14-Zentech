import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFromAcceptanceDto {
  @IsOptional()
  @IsDateString({}, { message: 'Hạn thanh toán không đúng định dạng YYYY-MM-DD' })
  dueDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Thuế suất VAT (%) phải là số' })
  @Min(0, { message: 'Thuế suất VAT tối thiểu 0%' })
  @Max(100, { message: 'Thuế suất VAT tối đa 100%' })
  taxRate?: number = 10;
}
