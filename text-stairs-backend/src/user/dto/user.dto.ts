import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  full_name?: string;

  @IsEmail()
  email?: string;

  @IsStrongPassword()
  password?: string;
}
