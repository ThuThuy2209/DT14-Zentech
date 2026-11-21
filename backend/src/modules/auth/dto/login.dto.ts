import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Tên đăng nhập hoặc Email',
  })
  @IsNotEmpty({ message: 'Tên đăng nhập hoặc email không được để trống' })
  usernameOrEmail!: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Mật khẩu',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password!: string;
}
