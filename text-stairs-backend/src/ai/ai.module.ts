import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MakeApiRequest } from './utils/apiRequest';
import { PromptGenerationService } from './utils/promptGeneration.service';
import { SummarizeTokenUsage } from './utils/summarizeTokenUsage';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    PrismaService,
    MakeApiRequest,
    SummarizeTokenUsage,
    PromptGenerationService,
  ],
})
export class AiModule {}
