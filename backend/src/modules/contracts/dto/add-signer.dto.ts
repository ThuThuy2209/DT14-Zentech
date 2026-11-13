import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddSignerDto {
  @IsNotEmpty({ message: 'Tên người ký không được để trống' })
  @IsString({ message: 'Tên người ký phải là chuỗi' })
  @MaxLength(255, { message: 'Tên người ký tối đa 255 ký tự' })
  signerName: string;

  @IsNotEmpty({ message: 'Email người ký không được để trống' })
  @IsEmail({}, { message: 'Email người ký không đúng định dạng' })
  @MaxLength(150, { message: 'Email tối đa 150 ký tự' })
  signerEmail: string;

  @IsOptional()
  @IsString({ message: 'Vai trò người ký phải là chuỗi' })
  @MaxLength(100, { message: 'Vai trò tối đa 100 ký tự' })
  signerRole?: string = 'Đại diện Khách hàng';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thứ tự ký phải là số nguyên' })
  @Min(1, { message: 'Thứ tự ký bắt đầu từ 1' })
  signingOrder?: number = 1;
}
