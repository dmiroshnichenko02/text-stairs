import { Body, Controller, Get, Put, Request } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator'; // Декоратор для проверки аутентификации
import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@Request() req: any) {
    return this.userService.byId(Number(req.user.id));
  }

  @Put('profile')
  @Auth()
  async updateUserProfile(@Body() dto: UpdateUserDto, @Request() req: any) {
    return await this.userService.updateProfile(Number(req.user.id), dto);
  }
}
