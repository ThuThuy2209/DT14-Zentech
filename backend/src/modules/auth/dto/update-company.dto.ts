import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class UpdateCompanyDto {
  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên công ty phải có ít nhất 3 ký tự' })
  @MaxLength(255, { message: 'Tên công ty tối đa 255 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/]+$/u, {
    message:
      'Tên công ty không hợp lệ (phải có chữ cái, không chứa dấu phẩy hoặc ký tự đặc biệt lạ)',
  })
  companyName?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã số thuế phải là chuỗi ký tự' })
  @Matches(/^\d{10}(-\d{3})?$/, {
    message:
      'Mã số thuế không hợp lệ (phải gồm 10 chữ số hoặc 13 chữ số dạng 0123456789-001)',
  })
  taxCode?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MinLength(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự' })
  @MaxLength(500, { message: 'Địa chỉ tối đa 500 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s,./\-()]+$/u, {
    message:
      'Địa chỉ không hợp lệ (phải có tên đường/khu vực bằng chữ cái và không chứa ký tự đặc biệt lạ)',
  })
  address?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsEmail({}, { message: 'Email công ty không đúng định dạng' })
  @MaxLength(150, { message: 'Email tối đa 150 ký tự' })
  email?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Matches(/^(0|\+84)(?:\s?\d){9,10}$/, {
    message:
      'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và gồm 10-11 chữ số, không chứa chữ cái)',
  })
  phone?: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Người đại diện pháp luật phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên người đại diện phải có ít nhất 2 ký tự' })
  @MaxLength(150, { message: 'Người đại diện tối đa 150 ký tự' })
  @Matches(/^[\p{L}\s.'-]+$/u, {
    message:
      'Tên người đại diện chỉ được chứa chữ cái và khoảng trắng (không chứa số hoặc ký tự đặc biệt)',
  })
  representative?: string;
}
