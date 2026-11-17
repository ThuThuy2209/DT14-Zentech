import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'Danh mục chi phí không được để trống' })
  @IsString({ message: 'Danh mục chi phí phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Danh mục chi phí tối đa 100 ký tự' })
  category!: string;

  @IsOptional()
  @IsString({ message: 'Mô tả chi phí phải là chuỗi ký tự' })
  description?: string;

  @IsNotEmpty({ message: 'Số tiền chi không được để trống' })
  @IsNumber({}, { message: 'Số tiền chi phải là một số hợp lệ' })
  @IsPositive({ message: 'Số tiền chi phải lớn hơn 0' })
  amount!: number;

  @IsNotEmpty({ message: 'Ngày phát sinh chi phí không được để trống' })
  @IsDateString({}, { message: 'Ngày phát sinh chi phí không đúng định dạng ISO (YYYY-MM-DD)' })
  expenseDate!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hạn thanh toán không đúng định dạng ISO (YYYY-MM-DD)' })
  dueDate?: string;

  @IsOptional()
  @IsIn(['PAID', 'UNPAID', 'CANCELLED'], {
    message: 'Trạng thái chi phí phải là PAID, UNPAID hoặc CANCELLED',
  })
  status?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Mã tài liệu chứng từ (documentId) phải là số' })
  documentId?: number;
}
