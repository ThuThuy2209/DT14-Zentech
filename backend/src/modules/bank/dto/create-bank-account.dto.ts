import {
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

export class CreateBankAccountDto {
  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên ngân hàng không được để trống' })
  @IsString({ message: 'Tên ngân hàng phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên ngân hàng phải có ít nhất 3 ký tự' })
  @MaxLength(150, { message: 'Tên ngân hàng tối đa 150 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/]+$/u, {
    message:
      'Tên ngân hàng không hợp lệ (phải chứa chữ cái và không chứa ký tự đặc biệt lạ)',
  })
  bankName!: string;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Số tài khoản không được để trống' })
  @IsString({ message: 'Số tài khoản phải là chuỗi ký tự' })
  @Matches(/^\d{6,20}$/, {
    message: 'Số tài khoản ngân hàng không hợp lệ (chỉ được chứa từ 6 đến 20 chữ số)',
  })
  accountNumber!: string;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên chủ tài khoản không được để trống' })
  @IsString({ message: 'Tên chủ tài khoản phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên chủ tài khoản phải có ít nhất 2 ký tự' })
  @MaxLength(150, { message: 'Tên chủ tài khoản tối đa 150 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().'-]+$/u, {
    message:
      'Tên chủ tài khoản không hợp lệ (phải chứa chữ cái và không có ký tự đặc biệt lạ)',
  })
  accountHolder!: string;

  @Transform(trimString)
  @IsOptional()
  @IsString({ message: 'Loại tiền tệ phải là chuỗi ký tự' })
  @Matches(/^[A-Z]{3}$/, {
    message: 'Mã tiền tệ phải gồm 3 chữ cái in hoa (VD: VND, USD)',
  })
  currency?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái tài khoản phải là ACTIVE hoặc INACTIVE',
  })
  status?: string;
}
