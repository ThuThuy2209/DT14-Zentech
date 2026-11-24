import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UploadStatementDto {
  @IsNotEmpty({ message: 'Vui lòng chọn tài khoản ngân hàng (accountId)' })
  @IsNumberString({}, { message: 'Mã tài khoản ngân hàng (accountId) phải là số' })
  accountId!: string;
}
