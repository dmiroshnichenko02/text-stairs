import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai/ai.controller';
import { AiModule } from './ai/ai.module';
import { AiService } from './ai/ai.service';
import { MakeApiRequest } from './ai/utils/apiRequest';
import { SummarizeTokenUsage } from './ai/utils/summarizeTokenUsage';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { BooksController } from './books/books.controller';
import { BooksModule } from './books/books.module';
import { BooksService } from './books/books.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    AiModule,
    BooksModule,
  ],
  controllers: [AppController, AuthController, AiController, BooksController],
  providers: [
    AppService,
    UserService,
    BooksService,
    PrismaService,
    AiService,
    MakeApiRequest,
    SummarizeTokenUsage,
  ],
})
export class AppModule {}
