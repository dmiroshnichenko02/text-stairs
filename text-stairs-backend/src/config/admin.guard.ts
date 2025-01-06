import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserModel } from 'src/owner/dto/user.dto';

export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>();
    const user = request.user;

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Only admin can do this');
    }

    return true;
  }
}
