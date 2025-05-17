import { BadRequestException, Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { PrismaService } from 'src/prisma.service';
import { MakeApiRequest } from './utils/apiRequest';
import {
  PROMPT_CONFIGS,
  PromptGenerationService,
} from './utils/promptGeneration.service';
import { SummarizeTokenUsage, TokenUsage } from './utils/summarizeTokenUsage';

@Injectable()
export class AiService {
  private readonly MAX_TOKENS = 8000;
  private readonly WORDS_PER_TOKEN = 0.75;
  private readonly CHUNK_SIZE = Math.floor(
    this.MAX_TOKENS * this.WORDS_PER_TOKEN,
  );

  constructor(
    private prisma: PrismaService,
    private readonly summarizeTokenUsage: SummarizeTokenUsage,
    private readonly makeApiRequest: MakeApiRequest,
    private readonly promptService: PromptGenerationService,
  ) {}

  async textQuotes(
    file: Express.Multer.File,
    userId: number,
  ): Promise<{
    bookId: number;
    pageCount: number;
    chunkSummaries: string[];
    finalSummary: string;
    tokenUsage: TokenUsage;
  }> {
    const { text, pageCount, user, bookLimit, pagePerBook } =
      await this.validateAndPrepareBook(file, userId);

    const startTime = Date.now();
    console.log('Book analysis started...');

    let totalTokenUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    const textChunks = this.splitIntoChunks(text);
    const { analyses: chunkAnalyses, usage: chunkUsage } =
      await this.analyzeChunks(textChunks, PROMPT_CONFIGS.TEXT_QUESTIONS);

    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      chunkUsage,
    );

    const { analysis: finalAnalysis, usage: finalUsage } =
      await this.createFinalAnalysis(
        chunkAnalyses,
        PROMPT_CONFIGS.TEXT_QUESTIONS,
      );

    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      finalUsage,
    );

    const book = await this.prisma.book.create({
      data: {
        book_name: file.originalname.replace('.pdf', ''),
        page_count: pageCount,
        final_analysis: finalAnalysis,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    this.logAnalysisCompletion(startTime, totalTokenUsage);

    return {
      bookId: book.id,
      pageCount,
      chunkSummaries: chunkAnalyses,
      finalSummary: finalAnalysis,
      tokenUsage: totalTokenUsage,
    };
  }

  async charactersQuotes(
    file: Express.Multer.File,
    userId: number,
  ): Promise<{
    bookId: number;
    pageCount: number;
    chunkSummaries: string[];
    finalSummary: string;
    tokenUsage: TokenUsage;
  }> {
    const { text, pageCount, user, bookLimit, pagePerBook } =
      await this.validateAndPrepareBook(file, userId);

    const startTime = Date.now();
    console.log('Book analysis started...');

    let totalTokenUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    const textChunks = this.splitIntoChunks(text);
    const { analyses: chunkAnalyses, usage: chunkUsage } =
      await this.analyzeChunks(
        textChunks,
        PROMPT_CONFIGS.LITERATURE_CHARACTER_QUOTES,
      );

    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      chunkUsage,
    );

    const { analysis: finalAnalysis, usage: finalUsage } =
      await this.createFinalAnalysis(
        chunkAnalyses,
        PROMPT_CONFIGS.LITERATURE_CHARACTER_QUOTES,
      );

    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      finalUsage,
    );

    const book = await this.prisma.book.create({
      data: {
        book_name: file.originalname.replace('.pdf', ''),
        page_count: pageCount,
        final_analysis: finalAnalysis,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    this.logAnalysisCompletion(startTime, totalTokenUsage);

    return {
      bookId: book.id,
      pageCount,
      chunkSummaries: chunkAnalyses,
      finalSummary: finalAnalysis,
      tokenUsage: totalTokenUsage,
    };
  }

  async shortSummarizeBook(
    file: Express.Multer.File,
    userId: number,
  ): Promise<{
    bookId: number;
    pageCount: number;
    chunkSummaries: string[];
    finalSummary: string;
    tokenUsage: TokenUsage;
  }> {
    const { text, pageCount, user, bookLimit, pagePerBook } =
      await this.validateAndPrepareBook(file, userId);

    const startTime = Date.now();
    console.log('Book analysis started...');

    let totalTokenUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    const textChunks = this.splitIntoChunks(text);
    const { analyses: chunkAnalyses, usage: chunkUsage } =
      await this.analyzeChunks(textChunks, PROMPT_CONFIGS.SHORT_ANALYSIS);

    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      chunkUsage,
    );

    const { analysis: finalAnalysis, usage: finalUsage } =
      await this.createFinalAnalysis(
        chunkAnalyses,
        PROMPT_CONFIGS.SHORT_ANALYSIS,
      );

    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      finalUsage,
    );

    const book = await this.prisma.book.create({
      data: {
        book_name: file.originalname.replace('.pdf', ''),
        page_count: pageCount,
        final_analysis: finalAnalysis,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    this.logAnalysisCompletion(startTime, totalTokenUsage);

    return {
      bookId: book.id,
      pageCount,
      chunkSummaries: chunkAnalyses,
      finalSummary: finalAnalysis,
      tokenUsage: totalTokenUsage,
    };
  }

  async analyzeBook(file: Express.Multer.File, userId: number) {
    try {
      const { text, pageCount, user, bookLimit, pagePerBook } =
        await this.validateAndPrepareBook(file, userId);

      const startTime = Date.now();
      console.log('Book analysis started...');

      let totalTokenUsage: TokenUsage = {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      const textChunks = this.splitIntoChunks(text);
      const { analyses: chunkAnalyses, usage: chunkUsage } =
        await this.analyzeChunks(textChunks, PROMPT_CONFIGS.FULL_ANALYSIS);

      totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
        totalTokenUsage,
        chunkUsage,
      );

      const { analysis: finalAnalysis, usage: finalUsage } =
        await this.createFinalAnalysis(
          chunkAnalyses,
          PROMPT_CONFIGS.FULL_ANALYSIS,
        );

      totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
        totalTokenUsage,
        finalUsage,
      );

      const book = await this.prisma.book.create({
        data: {
          book_name: file.originalname.replace('.pdf', ''),
          page_count: pageCount,
          final_analysis: finalAnalysis,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      this.logAnalysisCompletion(startTime, totalTokenUsage);

      return {
        bookId: book.id,
        pageCount,
        chunkAnalyses,
        finalAnalysis,
        tokenUsage: totalTokenUsage,
      };
    } catch (error) {
      console.error('Error analyzing book:', error);
      throw new BadRequestException(error.message || 'Failed to analyze book');
    }
  }

  async getUserBookStats(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            current_period_end: {
              gt: new Date(),
            },
          },
          include: {
            plan: true,
          },
          orderBy: {
            current_period_end: 'desc',
          },
          take: 1,
        },
        books: {
          select: {
            id: true,
            book_name: true,
            page_count: true,
            created_at: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentPlan = user.subscriptions[0]?.plan;
    const pagePerBook = user.page_per_book || currentPlan?.page_per_book;
    const bookLimit = currentPlan?.book_limit || user.book_limit;

    const userBookCount = await this.prisma.book.count({
      where: { user_id: userId },
    });

    return {
      totalBooks: user.books.length,
      bookLimit,
      pagePerBookLimit: currentPlan?.page_per_book || user.page_per_book,
      books: user.books,
    };
  }

  private async validateAndPrepareBook(
    file: Express.Multer.File,
    userId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            current_period_end: {
              gt: new Date(),
            },
          },
          include: {
            plan: true,
          },
          orderBy: {
            current_period_end: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentPlan = user.subscriptions[0]?.plan;
    const pagePerBook = user.page_per_book || currentPlan?.page_per_book;
    const bookLimit = currentPlan?.book_limit || user.book_limit;

    const userBookCount = await this.prisma.book.count({
      where: { user_id: userId },
    });

    if (userBookCount >= bookLimit) {
      throw new BadRequestException(
        `You have reached your book limit (${bookLimit}). Please upgrade your plan to analyze more books.`,
      );
    }

    const pdfData = await pdf(file.buffer);
    const pageCount = pdfData.numpages;
    const text = pdfData.text;

    if (pageCount > pagePerBook) {
      throw new BadRequestException(
        `Document has ${pageCount} pages, which exceeds your current limit of ${pagePerBook} pages per book. Please upgrade your plan for larger books.`,
      );
    }

    return { text, pageCount, user, bookLimit, pagePerBook };
  }

  private splitIntoChunks(text: string): string[] {
    const paragraphs = text.split(/\n\n+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const paragraph of paragraphs) {
      const paragraphWords = paragraph.split(/\s+/).length;

      if (currentLength + paragraphWords > this.CHUNK_SIZE) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.join('\n\n'));
          currentChunk = [];
          currentLength = 0;
        }

        if (paragraphWords > this.CHUNK_SIZE) {
          const words = paragraph.split(/\s+/);
          for (let i = 0; i < words.length; i += this.CHUNK_SIZE) {
            chunks.push(words.slice(i, i + this.CHUNK_SIZE).join(' '));
          }
        } else {
          currentChunk.push(paragraph);
          currentLength = paragraphWords;
        }
      } else {
        currentChunk.push(paragraph);
        currentLength += paragraphWords;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
    }

    return chunks;
  }

  private async analyzeChunks(
    chunks: string[],
    promptConfig: (typeof PROMPT_CONFIGS)[keyof typeof PROMPT_CONFIGS],
  ): Promise<{ analyses: string[]; usage: TokenUsage }> {
    const analyses = [];
    let totalUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    for (const [index, chunkText] of chunks.entries()) {
      try {
        const prompt = this.promptService.generateChunkPrompt(
          promptConfig,
          chunkText,
          { current: index + 1, total: chunks.length },
        );

        const { content: analysis, usage } =
          await this.makeApiRequest.makeApiRequest(prompt);
        analyses.push(analysis);
        totalUsage = this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage);
        await new Promise((resolve) => setTimeout(resolve, 30000));
      } catch (error) {
        console.error(`Error analyzing chunk ${index + 1}:`, error);
        throw error;
      }
    }
    return { analyses, usage: totalUsage };
  }

  private async createFinalAnalysis(
    chunkAnalyses: string[],
    promptConfig: (typeof PROMPT_CONFIGS)[keyof typeof PROMPT_CONFIGS],
  ): Promise<{ analysis: string; usage: TokenUsage }> {
    const combinedAnalysis = chunkAnalyses.join('\n\n');
    const wordCount = combinedAnalysis.split(/\s+/).length;

    if (wordCount <= this.CHUNK_SIZE) {
      const prompt = this.promptService.generateFinalPrompt(
        promptConfig,
        combinedAnalysis,
      );
      const { content, usage } =
        await this.makeApiRequest.makeApiRequest(prompt);
      return { analysis: content, usage };
    }

    const analysisChunks = this.splitIntoChunks(combinedAnalysis);
    const subAnalyses = [];
    let totalUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    for (const [index, chunk] of analysisChunks.entries()) {
      const prompt = this.promptService.generateChunkPrompt(
        promptConfig,
        chunk,
        { current: index + 1, total: analysisChunks.length },
      );

      const { content: subAnalysis, usage } =
        await this.makeApiRequest.makeApiRequest(prompt);
      subAnalyses.push(subAnalysis);
      totalUsage = this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage);
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }

    const { analysis, usage } = await this.createFinalAnalysis(
      subAnalyses,
      promptConfig,
    );
    return {
      analysis,
      usage: this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage),
    };
  }

  private logAnalysisCompletion(startTime: number, tokenUsage: TokenUsage) {
    const endTime = Date.now();
    console.log(
      `Book analysis completed. Time taken: ${(endTime - startTime) / 1000}s`,
      `\nTotal token usage:`,
      `\n- Prompt tokens: ${tokenUsage.prompt_tokens}`,
      `\n- Completion tokens: ${tokenUsage.completion_tokens}`,
      `\n- Total tokens: ${tokenUsage.total_tokens}`,
    );
  }
}
