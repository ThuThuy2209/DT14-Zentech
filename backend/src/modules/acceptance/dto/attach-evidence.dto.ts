import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachEvidenceDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'documentId phải là số nguyên' })
  documentId?: number;

  @IsOptional()
  @IsString({ message: 'Tên tài liệu phải là chuỗi' })
  documentName?: string;

  @IsOptional()
  @IsString({ message: 'Đường dẫn tệp phải là chuỗi' })
  filePath?: string;

  @IsOptional()
  @IsString({ message: 'Loại tệp phải là chuỗi' })
  fileType?: string;
}
