import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async getAllPlans() {
    return await this.prisma.plan.findMany();
  }
}
