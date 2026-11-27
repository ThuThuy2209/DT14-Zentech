import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateTemplateDto {
  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên mẫu hợp đồng không được để trống' })
  @IsString({ message: 'Tên mẫu hợp đồng phải là chuỗi' })
  @MinLength(5, { message: 'Tên mẫu hợp đồng phải có ít nhất 5 ký tự' })
  @MaxLength(255, { message: 'Tên mẫu tối đa 255 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/,:_]+$/u, {
    message: 'Tên mẫu hợp đồng phải chứa chữ cái và không có ký tự đặc biệt lạ',
  })
  templateName: string;

  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Mô tả mẫu hợp đồng phải là chuỗi' })
  description?: string;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Nội dung điều khoản mẫu hợp đồng không được để trống' })
  @IsString({ message: 'Nội dung hợp đồng phải là chuỗi' })
  @MinLength(10, { message: 'Nội dung mẫu hợp đồng phải có ít nhất 10 ký tự' })
  content: string;

  @IsOptional()
  placeholderConfig?: any;
}
