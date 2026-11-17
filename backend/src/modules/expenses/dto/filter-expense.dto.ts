import { IsDateString, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterExpenseDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['PAID', 'UNPAID', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

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
