import { IsNumberString, IsOptional } from 'class-validator';

export class FilterStatementDto {
  @IsOptional()
  @IsNumberString()
  accountId?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
