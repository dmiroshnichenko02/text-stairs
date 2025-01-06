import { UseGuards, applyDecorators } from '@nestjs/common';
import { OnlyAdminGuard } from 'src/config/admin.guard';
import { JwtAuthGuard } from './guard/jwt.guard';

export const Auth = (role: 'ADMIN' | 'USER' = 'USER') =>
  applyDecorators(
    role === 'ADMIN'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );
