import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDto {
  @IsNotEmpty({ message: 'customerId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId: number;

  @IsNotEmpty({ message: 'Tên hợp đồng không được để trống' })
  @IsString({ message: 'Tên hợp đồng phải là chuỗi' })
  @MaxLength(255, { message: 'Tên hợp đồng tối đa 255 ký tự' })
  contractName: string;

  @IsOptional()
  @IsString({ message: 'Mã hợp đồng phải là chuỗi' })
  @MaxLength(50, { message: 'Mã hợp đồng tối đa 50 ký tự' })
  contractCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'quotationId phải là số nguyên' })
  quotationId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'templateVersionId phải là số nguyên' })
  templateVersionId?: number;

  @IsNotEmpty({ message: 'Giá trị hợp đồng không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá trị hợp đồng phải là số' })
  @IsPositive({ message: 'Giá trị hợp đồng phải lớn hơn 0' })
  contractValue: number;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu hợp đồng không đúng định dạng YYYY-MM-DD' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc hợp đồng không đúng định dạng YYYY-MM-DD' })
  endDate?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung hợp đồng phải là chuỗi' })
  contractContent?: string;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'DRAFT',
      'PENDING_SIGN',
      'SIGNING',
      'SIGNED',
      'REJECTED',
      'EXPIRED',
      'TERMINATED',
    ],
    {
      message:
        'Trạng thái hợp đồng chỉ có thể là: DRAFT, PENDING_SIGN, SIGNING, SIGNED, REJECTED, EXPIRED, TERMINATED',
    },
  )
  status?: string = 'DRAFT';
}
