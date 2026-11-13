import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAcceptanceDto {
  @IsNotEmpty({ message: 'contractId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'contractId phải là số nguyên' })
  contractId: number;

  @IsOptional()
  @IsString({ message: 'Mã nghiệm thu phải là chuỗi' })
  @MaxLength(50, { message: 'Mã nghiệm thu tối đa 50 ký tự' })
  acceptanceCode?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày nghiệm thu không đúng định dạng YYYY-MM-DD' })
  acceptanceDate?: string;

  @IsNotEmpty({ message: 'Nội dung hạng mục nghiệm thu không được để trống' })
  @IsString({ message: 'Nội dung nghiệm thu phải là chuỗi' })
  content: string;

  @IsNotEmpty({ message: 'Kết quả nghiệm thu không được để trống' })
  @IsString({ message: 'Kết quả nghiệm thu phải là chuỗi' })
  @IsIn(['PASSED', 'FAILED', 'NEED_FIX'], {
    message: 'Kết quả nghiệm thu chỉ có thể là: PASSED (Đạt), FAILED (Không đạt), NEED_FIX (Cần sửa đổi)',
  })
  result: string = 'PASSED';

  @IsOptional()
  @IsString({ message: 'Ghi chú các lỗi / vấn đề phát sinh phải là chuỗi' })
  issues?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'evidenceDocumentId phải là số nguyên ID của tài liệu' })
  evidenceDocumentId?: number;
}
