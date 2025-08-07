import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  readonly username: string;

  @MinLength(6)
  readonly password: string;
}