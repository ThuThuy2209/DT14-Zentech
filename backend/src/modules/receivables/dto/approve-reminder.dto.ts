import { IsOptional, IsString } from 'class-validator';

export class ApproveReminderDto {
  @IsOptional()
  @IsString({ message: 'Tiêu đề email phải là chuỗi' })
  subject?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung email phải là chuỗi' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'Email người nhận phải là chuỗi' })
  recipient?: string;
}
