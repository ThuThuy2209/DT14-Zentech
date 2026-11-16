import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty({ message: 'Tên mẫu hợp đồng không được để trống' })
  @IsString({ message: 'Tên mẫu hợp đồng phải là chuỗi' })
  @MaxLength(255, { message: 'Tên mẫu tối đa 255 ký tự' })
  templateName: string;

  @IsOptional()
  @IsString({ message: 'Mô tả mẫu hợp đồng phải là chuỗi' })
  description?: string;

  @IsNotEmpty({ message: 'Nội dung điều khoản mẫu hợp đồng không được để trống' })
  @IsString({ message: 'Nội dung hợp đồng phải là chuỗi' })
  content: string;

  @IsOptional()
  placeholderConfig?: any;
}
