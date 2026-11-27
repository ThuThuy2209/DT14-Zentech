import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class AddSignerDto {
  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên người ký không được để trống' })
  @IsString({ message: 'Tên người ký phải là chuỗi' })
  @MinLength(2, { message: 'Tên người ký phải có ít nhất 2 ký tự' })
  @MaxLength(255, { message: 'Tên người ký tối đa 255 ký tự' })
  @Matches(/^[\p{L}\s.'-]+$/u, {
    message:
      'Tên người ký chỉ được chứa chữ cái và khoảng trắng (không chứa số hoặc ký tự đặc biệt)',
  })
  signerName: string;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Email người ký không được để trống' })
  @IsEmail({}, { message: 'Email người ký không đúng định dạng' })
  @MaxLength(150, { message: 'Email tối đa 150 ký tự' })
  signerEmail: string;

  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Vai trò người ký phải là chuỗi' })
  @MinLength(2, { message: 'Vai trò người ký phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Vai trò tối đa 100 ký tự' })
  signerRole?: string = 'Đại diện Khách hàng';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thứ tự ký phải là số nguyên' })
  @Min(1, { message: 'Thứ tự ký bắt đầu từ 1' })
  signingOrder?: number = 1;
}
