import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ReconciliationStatus,
  TransactionType,
} from '../constants/bank.constant.js';

export class FilterTransactionDto {
  @IsOptional()
  @IsNumberString({}, { message: 'ID đợt sao kê phải là dạng số' })
  statementId?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'ID tài khoản ngân hàng phải là dạng số' })
  accountId?: number;

  @IsOptional()
  @IsIn(Object.values(ReconciliationStatus), {
    message: 'Trạng thái đối chiếu không hợp lệ',
  })
  reconciliationStatus?: string;

  @IsOptional()
  @IsIn(Object.values(TransactionType), {
    message: 'Loại giao dịch phải là IN (tiền vào), OUT (tiền ra) hoặc ALL',
  })
  type?: string;

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Từ ngày phải đúng định dạng YYYY-MM-DD' })
  fromDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Đến ngày phải đúng định dạng YYYY-MM-DD' })
  toDate?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Trang phải là dạng số' })
  page?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'Số lượng phần tử phải là dạng số' })
  limit?: number;
}
