import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterBankAccountDto {
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái lọc phải là ACTIVE hoặc INACTIVE',
  })
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
