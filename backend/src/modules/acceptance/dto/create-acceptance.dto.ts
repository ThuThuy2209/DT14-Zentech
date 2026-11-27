import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class CreateAcceptanceDto {
  @IsNotEmpty({ message: 'contractId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'contractId phải là số nguyên' })
  contractId: number;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã nghiệm thu phải là chuỗi' })
  @MinLength(3, { message: 'Mã nghiệm thu phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Mã nghiệm thu tối đa 50 ký tự' })
  @Matches(/^[\p{L}\p{N}\-_/]+$/u, {
    message:
      'Mã nghiệm thu chỉ được chứa chữ cái, chữ số và các ký tự -, _, /',
  })
  acceptanceCode?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày nghiệm thu không đúng định dạng YYYY-MM-DD' })
  acceptanceDate?: string;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Nội dung hạng mục nghiệm thu không được để trống' })
  @IsString({ message: 'Nội dung nghiệm thu phải là chuỗi' })
  @MinLength(5, { message: 'Nội dung nghiệm thu phải có ít nhất 5 ký tự' })
  @Matches(/^(?=.*[\p{L}]).+$/su, {
    message: 'Nội dung nghiệm thu phải chứa chữ cái mô tả hợp lệ',
  })
  content: string;

  @IsNotEmpty({ message: 'Kết quả nghiệm thu không được để trống' })
  @IsString({ message: 'Kết quả nghiệm thu phải là chuỗi' })
  @IsIn(['PASSED', 'FAILED', 'NEED_FIX'], {
    message: 'Kết quả nghiệm thu chỉ có thể là: PASSED (Đạt), FAILED (Không đạt), NEED_FIX (Cần sửa đổi)',
  })
  result: string = 'PASSED';

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Ghi chú các lỗi / vấn đề phát sinh phải là chuỗi' })
  issues?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'evidenceDocumentId phải là số nguyên ID của tài liệu' })
  evidenceDocumentId?: number;
}
