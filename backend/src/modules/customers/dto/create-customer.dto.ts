import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  @IsString({ message: 'Tên khách hàng phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên khách hàng tối đa 255 ký tự' })
  customerName: string;

  @IsOptional()
  @IsString({ message: 'Mã số thuế phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã số thuế tối đa 50 ký tự' })
  taxCode?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email khách hàng không đúng định dạng' })
  @MaxLength(150, { message: 'Email tối đa 150 ký tự' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(30, { message: 'Số điện thoại tối đa 30 ký tự' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Người liên hệ phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên người liên hệ tối đa 150 ký tự' })
  contactPerson?: string;

  @IsOptional()
  @IsString({ message: 'Trạng thái phải là chuỗi ký tự' })
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái chỉ có thể là ACTIVE hoặc INACTIVE',
  })
  status?: string;
}
