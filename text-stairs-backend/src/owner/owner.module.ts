import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService, PrismaService],
})
export class OwnerModule {}
