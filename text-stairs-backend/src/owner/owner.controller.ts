import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CreatePlanDto, UpdatePlanDto } from './dto/createPlan.dto';
import { UpdateUserDto } from './dto/user.dto';
import { OwnerService } from './owner.service';

@Controller('owner')
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get('users')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe())
  async getAllUsers(@Query('searchTerms') searchTerms: string) {
    return await this.ownerService.getAllUsers(searchTerms);
  }

  @Get('users')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe())
  async getUserById(@Query('id') id: string) {
    return await this.ownerService.getUserById(Number(id));
  }

  @Put('users')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe())
  async updateUserById(@Body() userUpdateData: UpdateUserDto, id: string) {
    return await this.ownerService.updateUser(userUpdateData, Number(id));
  }

  // Plans

  @Post('plan')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe())
  async createPlan(@Body() planData: CreatePlanDto) {
    return await this.ownerService.createPlan(planData);
  }

  @Put('plan')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe())
  async updatePlan(@Body() updatePlanData: UpdatePlanDto, id: string) {
    return await this.ownerService.updatePlan(updatePlanData, Number(id));
  }

  @Delete('plan')
  @Auth('ADMIN')
  @UsePipes(new ValidationPipe())
  async deletePlan(@Query('id') id: string) {
    return await this.ownerService.deletePlan(Number(id));
  }
}
