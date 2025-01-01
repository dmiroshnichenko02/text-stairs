import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { AuthUserCreateDto, AuthUserLoginDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(dto: AuthUserCreateDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (oldUser)
      throw new BadRequestException('User with this email already registered');

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, await genSalt(10)),
      },
    });

    if (!newUser)
      throw new BadRequestException('Something went wront on create user');

    const tokens = await this.issueTokenPair(String(newUser.id));

    return {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      status: newUser.status,
      role: newUser.role,
      page_per_book: newUser.page_per_book,
      book_limit: newUser.book_limit,
      ...tokens,
    };
  }

  async login(dto: AuthUserLoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      status: user.status,
      role: user.role,
      page_per_book: user.page_per_book,
      book_limit: user.book_limit,
      ...tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new BadRequestException('Please sign in');
    }

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      status: user.status,
      role: user.role,
      page_per_book: user.page_per_book,
      book_limit: user.book_limit,
      ...tokens,
    };
  }

  async validateUser(dto: AuthUserLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new BadRequestException('User with this email not found');

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async issueTokenPair(userId: string) {
    const secret = this.configService.get<string>('JWT_SECRET');

    try {
      const payload = { id: userId };

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: '15m',
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: '15d',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException('Failed to generate tokens');
    }
  }
}
