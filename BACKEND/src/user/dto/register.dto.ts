import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, {message: "Email khoông hợp lệ"})
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
