import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên công ty tối đa 255 ký tự' })
  companyName?: string;

  @IsOptional()
  @IsString({ message: 'Mã số thuế phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã số thuế tối đa 50 ký tự' })
  taxCode?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email công ty không đúng định dạng' })
  @MaxLength(150, { message: 'Email tối đa 150 ký tự' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(30, { message: 'Số điện thoại tối đa 30 ký tự' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Người đại diện pháp luật phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Người đại diện tối đa 150 ký tự' })
  representative?: string;
}
