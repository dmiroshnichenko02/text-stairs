import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Length } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Plan Name',
    example: 'Free Plan',
    required: true,
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Name must be string' })
  @Length(2, 100, {
    message: 'Name must be between 2 and 100 characters',
  })
  name: string;

  @ApiProperty({
    description: 'Plan Description',
    example: 'Free Plan',
    required: true,
    minLength: 2,
    maxLength: 255,
  })
  @IsString({ message: 'Description must be string' })
  @Length(2, 255, {
    message: 'Description must be between 2 and 255 characters',
  })
  description: string;

  @ApiProperty({
    description: 'Page Per book for plan',
    example: 150,
    required: true,
  })
  @IsNumber()
  page_per_book: number;

  @ApiProperty({
    description: 'Book limit for plan',
    example: 100,
    required: true,
  })
  @IsNumber()
  book_limit: number;

  @ApiProperty({
    description: 'Plan Price',
    example: 14.99,
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Billing interval for the plan',
    example: 'MONTHLY',
    required: true,
    enum: ['MONTHLY', 'YEARLY'],
  })
  @IsEnum(['MONTHLY', 'YEARLY'], {
    message: 'Billing interval must be either MONTHLY or YEARLY',
  })
  billing_interval: 'MONTHLY' | 'YEARLY';

  @ApiProperty({
    description: 'Plan type for the plan',
    example: 'FREE',
    required: true,
    enum: ['FREE', 'PAID'],
  })
  @IsEnum(['FREE', 'PAID'], {
    message: 'Billing interval must be either FREE or PAID',
  })
  plan_type: 'FREE' | 'PAID';
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
