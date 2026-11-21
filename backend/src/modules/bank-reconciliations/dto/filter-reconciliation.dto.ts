import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class FilterReconciliationDto {
  @IsOptional()
  @IsNumberString({}, { message: 'ID giao dịch phải là dạng số' })
  transactionId?: number;

  @IsOptional()
  @IsIn(['CONFIRMED', 'REJECTED', 'PROPOSED'], {
    message: 'Trạng thái đối chiếu không hợp lệ',
  })
  matchStatus?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Trang phải là dạng số' })
  page?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'Số lượng phải là dạng số' })
  limit?: number;
}
