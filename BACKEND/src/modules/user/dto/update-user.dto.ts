import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  email: string;
}
