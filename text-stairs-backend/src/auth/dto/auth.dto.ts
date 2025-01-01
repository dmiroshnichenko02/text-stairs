import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class AuthUserCreateDto {
  @ApiProperty({
    description: 'User Full Name',
    example: 'John Smith',
    required: true,
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'User Full Name must be string' })
  @Length(2, 100, {
    message: 'The full name must be between 2 and 100 characters',
  })
  full_name?: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description:
      'User password. Must contain a minimum of 8 characters, including uppercase and lowercase letters, numbers and special characters',
    example: 'StrongP@ss123',
    required: true,
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'The password must contain a minimum of 8 characters, including uppercase and lowercase letters, numbers and special characters',
    },
  )
  password: string;
}

export class AuthUserLoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'User password.',
    example: 'StrongP@ss123',
    required: true,
  })
  @IsString()
  password: string;
}
