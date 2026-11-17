import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuoteStatusDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsString({ message: 'Trạng thái phải là chuỗi ký tự' })
  @IsIn(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'], {
    message: 'Trạng thái chỉ có thể là: DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED',
  })
  status: string;
}
