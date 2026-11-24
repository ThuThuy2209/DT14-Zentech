import { IsIn, IsNotEmpty } from 'class-validator';
import { BankAccountStatus } from '../constants/bank.constant.js';

export class UpdateBankAccountStatusDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsIn(Object.values(BankAccountStatus), {
    message: 'Trạng thái phải là ACTIVE hoặc INACTIVE',
  })
  status!: string;
}
