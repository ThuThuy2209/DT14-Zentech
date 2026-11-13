import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAcceptanceDto {
  @IsOptional()
  @IsDateString({}, { message: 'Ngày nghiệm thu không đúng định dạng YYYY-MM-DD' })
  acceptanceDate?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung nghiệm thu phải là chuỗi' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'Kết quả nghiệm thu phải là chuỗi' })
  @IsIn(['PASSED', 'FAILED', 'NEED_FIX'], {
    message: 'Kết quả nghiệm thu chỉ có thể là: PASSED (Đạt), FAILED (Không đạt), NEED_FIX (Cần sửa đổi)',
  })
  result?: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú các lỗi / vấn đề phát sinh phải là chuỗi' })
  issues?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'evidenceDocumentId phải là số nguyên ID của tài liệu' })
  evidenceDocumentId?: number;
}
