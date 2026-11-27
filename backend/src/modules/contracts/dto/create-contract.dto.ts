import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class CreateContractDto {
  @IsNotEmpty({ message: 'customerId không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'customerId phải là số nguyên' })
  customerId: number;

  @Transform(trimString)
  @IsNotEmpty({ message: 'Tên hợp đồng không được để trống' })
  @IsString({ message: 'Tên hợp đồng phải là chuỗi' })
  @MinLength(5, { message: 'Tên hợp đồng phải có ít nhất 5 ký tự' })
  @MaxLength(255, { message: 'Tên hợp đồng tối đa 255 ký tự' })
  @Matches(/^(?=.*[\p{L}])[\p{L}\p{N}\s&().\-\/,:_]+$/u, {
    message:
      'Tên hợp đồng không hợp lệ (phải có chữ cái và không chứa ký tự đặc biệt lạ)',
  })
  contractName: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Mã hợp đồng phải là chuỗi' })
  @MinLength(3, { message: 'Mã hợp đồng phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Mã hợp đồng tối đa 50 ký tự' })
  @Matches(/^[\p{L}\p{N}\-_/]+$/u, {
    message:
      'Mã hợp đồng chỉ được chứa chữ cái, chữ số và các ký tự -, _, / (không chứa khoảng trắng)',
  })
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

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Nội dung hợp đồng phải là chuỗi' })
  @MinLength(10, { message: 'Nội dung hợp đồng phải có ít nhất 10 ký tự' })
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
