import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/createPlan.dto';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  // Users
  async getAllUsers(search: string) {
    const users = await this.prisma.user.findMany({
      where: {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        full_name: user.full_name,
        page_per_book: user.page_per_book,
        role: user.role,
        status: user.status,
        book_limit: user.book_limit,
      };
    });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not Found');

    return {
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      status: user.status,
      role: user.role,
      page_per_book: user.page_per_book,
      book_limit: user.book_limit,
    };
  }

  async updateUser(userUpdateData: UpdateUserDto, id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not Found');

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: userUpdateData,
    });

    if (!updatedUser) throw new BadRequestException('Error on update user');

    return {
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
      status: updatedUser.status,
      role: updatedUser.role,
      page_per_book: updatedUser.page_per_book,
      book_limit: updatedUser.book_limit,
    };
  }

  // Plans
  async createPlan(planData: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
      data: planData,
    });

    if (!plan) throw new BadRequestException('New plan not created');

    return plan;
  }

  async updatePlan(planUpdateData: UpdatePlanDto, id: number) {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id,
      },
    });

    if (!plan) throw new BadRequestException(' Plan not Found');

    const updatedPlan = await this.prisma.plan.update({
      where: {
        id,
      },
      data: planUpdateData,
    });

    if (!updatedPlan) throw new BadRequestException(' Plan not Updated');

    return updatedPlan;
  }

  async deletePlan(id: number) {
    const plan = await this.prisma.plan.delete({
      where: {
        id,
      },
    });

    return {
      status: 'deleted',
      plan,
    };
  }
}
