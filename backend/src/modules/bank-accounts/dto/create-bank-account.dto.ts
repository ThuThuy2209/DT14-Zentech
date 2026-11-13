import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBankAccountDto {
  @IsNotEmpty({ message: 'Tên ngân hàng không được để trống' })
  @IsString({ message: 'Tên ngân hàng phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên ngân hàng tối đa 150 ký tự' })
  bankName!: string;

  @IsNotEmpty({ message: 'Số tài khoản không được để trống' })
  @IsString({ message: 'Số tài khoản phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Số tài khoản tối đa 50 ký tự' })
  accountNumber!: string;

  @IsNotEmpty({ message: 'Tên chủ tài khoản không được để trống' })
  @IsString({ message: 'Tên chủ tài khoản phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên chủ tài khoản tối đa 150 ký tự' })
  accountHolder!: string;

  @IsOptional()
  @IsString({ message: 'Loại tiền tệ phải là chuỗi ký tự' })
  @MaxLength(10, { message: 'Loại tiền tệ tối đa 10 ký tự' })
  currency?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái tài khoản phải là ACTIVE hoặc INACTIVE',
  })
  status?: string;
}
