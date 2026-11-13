import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateServicePriceDto {
  @IsNotEmpty({ message: 'Đơn giá mới không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  @Min(0, { message: 'Đơn giá không được âm' })
  unitPrice: number;
}
