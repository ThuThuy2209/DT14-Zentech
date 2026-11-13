import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateBankAccountStatusDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái phải là ACTIVE hoặc INACTIVE',
  })
  status!: string;
}
