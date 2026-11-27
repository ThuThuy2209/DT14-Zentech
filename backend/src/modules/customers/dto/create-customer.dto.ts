import {
  IsEmail,
  IsIn,
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

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class CreateCustomerDto {
  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  @IsString({ message: 'Tên khách hàng phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên khách hàng phải có ít nhất 3 ký tự' })
  @MaxLength(255, { message: 'Tên khách hàng tối đa 255 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/]+$/u, {
    message:
      'Tên khách hàng không hợp lệ (phải có chữ cái, không chứa dấu phẩy hoặc ký tự đặc biệt lạ)',
  })
  customerName: string;

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
  @IsEmail({}, { message: 'Email khách hàng không đúng định dạng' })
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
  @IsString({ message: 'Người liên hệ phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên người liên hệ phải có ít nhất 2 ký tự' })
  @MaxLength(150, { message: 'Tên người liên hệ tối đa 150 ký tự' })
  @Matches(/^[\p{L}\s.'-]+$/u, {
    message:
      'Tên người liên hệ chỉ được chứa chữ cái và khoảng trắng (không chứa số hoặc ký tự đặc biệt)',
  })
  contactPerson?: string;

  @IsOptional()
  @IsString({ message: 'Trạng thái phải là chuỗi ký tự' })
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái chỉ có thể là ACTIVE hoặc INACTIVE',
  })
  status?: string;
}
