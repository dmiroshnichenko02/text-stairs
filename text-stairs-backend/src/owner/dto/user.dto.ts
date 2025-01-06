import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full Name',
    example: 'John Smith',
    required: true,
    minLength: 2,
    maxLength: 255,
  })
  @IsString({ message: 'Full Name must be string' })
  @Length(2, 255, {
    message: 'Full Name must be between 2 and 255 characters',
  })
  full_name?: string;

  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User Role',
    example: 'USER',
    required: true,
    enum: ['USER', 'ADMIN'],
  })
  @IsEnum(['USER', 'ADMIN'], {
    message: 'Billing interval must be either USER or ADMIN',
  })
  role?: 'USER' | 'ADMIN';

  @ApiProperty({
    description: 'User page per book limit',
    example: 120,
    required: true,
  })
  @IsNumber()
  page_per_book?: number;

  @ApiProperty({
    description: 'User book limit',
    example: 120,
    required: true,
  })
  @IsNumber()
  book_limit?: number;
}

export class UserModel {
  id: number;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  page_per_book: number;
  book_limit: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
