import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async byId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        books: {
          select: {
            id: true,
            book_name: true,
            final_analysis: true,
            page_count: true,
          },
        },
        subscriptions: {
          include: {
            plan: {
              select: {
                name: true,
                price: true,
                billing_interval: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new BadRequestException('User not found');

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      status: user.status,
      role: user.role,
      page_per_book: user.page_per_book,
      book_limit: user.book_limit,
      subscription: user.subscriptions,
      books: user.books,
    };
  }

  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (isSameUser && id !== isSameUser.id)
      throw new NotFoundException('Email busy');

    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }

    if (dto.email) {
      user.email = dto.email;
    }

    if (dto.full_name) {
      user.full_name = dto.full_name;
    }

    const updatedUserProfile = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: user,
    });

    return {
      email: updatedUserProfile.email,
      id: updatedUserProfile.id,
      full_name: updatedUserProfile.full_name,
      status: updatedUserProfile.status,
      role: user.role,
      page_per_book: user.page_per_book,
      book_limit: user.book_limit,
    };
  }
}
