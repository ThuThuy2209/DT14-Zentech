import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReminderDraftDto {
  @IsNotEmpty({ message: 'salesInvoiceId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'salesInvoiceId phải là số nguyên' })
  salesInvoiceId: number;

  @IsOptional()
  @IsString({ message: 'Ghi chú thêm cho AI phải là chuỗi' })
  customPrompt?: string;
}
