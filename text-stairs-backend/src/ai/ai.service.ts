import { BadRequestException, Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { PrismaService } from 'src/prisma.service';
import { MakeApiRequest } from './utils/apiRequest';
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
  ) {}

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
    const startTime = Date.now();
    console.log('Book analysis started...');

    // Initialize token usage tracking
    let totalTokenUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    // Get user with their current subscription info
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

    // Get user's current limits
    const currentPlan = user.subscriptions[0]?.plan;
    const pagePerBook = currentPlan?.page_per_book || user.page_per_book;
    const bookLimit = currentPlan?.book_limit || user.book_limit;

    // Check book count limit
    const userBookCount = await this.prisma.book.count({
      where: { user_id: userId },
    });

    if (userBookCount >= bookLimit) {
      throw new BadRequestException(
        `You have reached your book limit (${bookLimit}). Please upgrade your plan to analyze more books.`,
      );
    }

    // Extract PDF info and validate
    const pdfData = await pdf(file.buffer);
    const pageCount = pdfData.numpages;
    const text = pdfData.text;

    if (pageCount > pagePerBook) {
      throw new BadRequestException(
        `Document has ${pageCount} pages, which exceeds your current limit of ${pagePerBook} pages per book. Please upgrade your plan for larger books.`,
      );
    }

    // Analyze the book
    const textChunks = this.splitIntoChunks(text);
    const { analyses: chunkAnalyses, usage: chunkUsage } =
      await this.analyzeChunksForShortSummarize(textChunks);
    totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
      totalTokenUsage,
      chunkUsage,
    );

    const { analysis: finalAnalysis, usage: finalUsage } =
      await this.createFinalAnalysisForShortSummarize(chunkAnalyses);
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

    const endTime = Date.now();
    console.log(
      `Book analysis completed. Time taken: ${(endTime - startTime) / 1000}s`,
      `\nTotal token usage:`,
      `\n- Prompt tokens: ${totalTokenUsage.prompt_tokens}`,
      `\n- Completion tokens: ${totalTokenUsage.completion_tokens}`,
      `\n- Total tokens: ${totalTokenUsage.total_tokens}`,
    );

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
      const startTime = Date.now();
      console.log('Book analysis started...');

      // Initialize token usage tracking
      let totalTokenUsage: TokenUsage = {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      // Get user with their current subscription info
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

      // Get user's current limits
      const currentPlan = user.subscriptions[0]?.plan;
      const pagePerBook = currentPlan?.page_per_book || user.page_per_book;
      const bookLimit = currentPlan?.book_limit || user.book_limit;

      // Check book count limit
      const userBookCount = await this.prisma.book.count({
        where: { user_id: userId },
      });

      if (userBookCount >= bookLimit) {
        throw new BadRequestException(
          `You have reached your book limit (${bookLimit}). Please upgrade your plan to analyze more books.`,
        );
      }

      // Extract PDF info and validate
      const pdfData = await pdf(file.buffer);
      const pageCount = pdfData.numpages;
      const text = pdfData.text;

      if (pageCount > pagePerBook) {
        throw new BadRequestException(
          `Document has ${pageCount} pages, which exceeds your current limit of ${pagePerBook} pages per book. Please upgrade your plan for larger books.`,
        );
      }

      // Analyze the book
      const textChunks = this.splitIntoChunks(text);
      const { analyses: chunkAnalyses, usage: chunkUsage } =
        await this.analyzeChunks(textChunks);
      totalTokenUsage = this.summarizeTokenUsage.sumTokenUsage(
        totalTokenUsage,
        chunkUsage,
      );

      const { analysis: finalAnalysis, usage: finalUsage } =
        await this.createFinalAnalysis(chunkAnalyses);
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

      const endTime = Date.now();
      console.log(
        `Book analysis completed. Time taken: ${(endTime - startTime) / 1000}s`,
        `\nTotal token usage:`,
        `\n- Prompt tokens: ${totalTokenUsage.prompt_tokens}`,
        `\n- Completion tokens: ${totalTokenUsage.completion_tokens}`,
        `\n- Total tokens: ${totalTokenUsage.total_tokens}`,
      );

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
    return {
      totalBooks: user.books.length,
      bookLimit: currentPlan?.book_limit || user.book_limit,
      pagePerBookLimit: currentPlan?.page_per_book || user.page_per_book,
      books: user.books,
    };
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
  ): Promise<{ analyses: string[]; usage: TokenUsage }> {
    const analyses = [];
    let totalUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    for (const [index, chunkText] of chunks.entries()) {
      try {
        const { content: analysis, usage } =
          await this.makeApiRequest.makeApiRequest(
            `Analyze this portion of the text (Part ${index + 1} of ${chunks.length}):
            - Key points of the text
            - Characters if there is
            - Brief history of the characters if there is
            - Sequence of events
            - Genre of the work
            - Stylistic features
            - Main theme of the text
            - Idea of the text
            - Problematic or key issues that are addressed
            - What the text is about
            
            Respond in the language of the provided text.
  
            Text: ${chunkText}`,
          );
        analyses.push(analysis);
        totalUsage = this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error analyzing chunk ${index + 1}:`, error);
        throw error;
      }
    }
    return { analyses, usage: totalUsage };
  }

  private async createFinalAnalysis(
    chunkAnalyses: string[],
  ): Promise<{ analysis: string; usage: TokenUsage }> {
    const combinedAnalysis = chunkAnalyses.join('\n\n');
    const wordCount = combinedAnalysis.split(/\s+/).length;

    if (wordCount <= this.CHUNK_SIZE) {
      const { content, usage } = await this.makeApiRequest.makeApiRequest(
        `Based on the following analyses of different parts of the book, 
        provide a comprehensive analysis of the entire work. Include:
        - Key moments of the book
        - Characters and their stories if there is
        - Sequence of events
        - Genre of the work
        - Stylistic features
        - Main theme of the book
        - Problematic or key issues raised
        Respond in the language of the provided text.
  
        Individual analyses:
        ${combinedAnalysis}`,
      );
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
      const { content: subAnalysis, usage } =
        await this.makeApiRequest.makeApiRequest(
          `This is part ${index + 1} of ${analysisChunks.length} of the book analysis.
          Based on the following portion of analyses, provide a consolidated summary
          focusing on:
          - Key points of the text
          - Characters if there is
          - Brief history of the characters if there is
          - Sequence of events
          - Genre of the work
          - Stylistic features
          - Main theme of the text
          - Idea of the text
          - Problematic or key issues that are addressed
          - What the text is about
  
          Respond in the language of the provided text.
  
          ${chunk}`,
        );
      subAnalyses.push(subAnalysis);
      totalUsage = this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const { analysis, usage } = await this.createFinalAnalysis(subAnalyses);
    return {
      analysis,
      usage: this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage),
    };
  }

  // Short summarize

  private async analyzeChunksForShortSummarize(
    chunks: string[],
  ): Promise<{ analyses: string[]; usage: TokenUsage }> {
    const analyses = [];
    let totalUsage: TokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    for (const [index, chunkText] of chunks.entries()) {
      try {
        const { content: analysis, usage } =
          await this.makeApiRequest.makeApiRequest(
            `Analyze this portion of the text (Part ${index + 1} of ${chunks.length}):
            - Key points of the text
            - Characters if there is
            - Brief history of characters if there is
            - Sequence of events
            
            Respond in the language of the provided text.
  
            Text: ${chunkText}`,
          );
        analyses.push(analysis);
        totalUsage = this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error analyzing chunk ${index + 1}:`, error);
        throw error;
      }
    }
    return { analyses, usage: totalUsage };
  }

  private async createFinalAnalysisForShortSummarize(
    chunkAnalyses: string[],
  ): Promise<{ analysis: string; usage: TokenUsage }> {
    const combinedAnalysis = chunkAnalyses.join('\n\n');
    const wordCount = combinedAnalysis.split(/\s+/).length;

    if (wordCount <= this.CHUNK_SIZE) {
      const { content, usage } = await this.makeApiRequest.makeApiRequest(
        `Based on the following analyses of different parts of the book, 
        provide a comprehensive analysis of the entire work. Include:
          - Key points of the text
          - Characters if there is
          - Brief history of characters if there is
          - Sequence of events

        Respond in the language of the provided text.
  
        Individual analyses:
        ${combinedAnalysis}`,
      );
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
      const { content: subAnalysis, usage } =
        await this.makeApiRequest.makeApiRequest(
          `This is part ${index + 1} of ${analysisChunks.length} of the book analysis.
          Based on the following portion of analyses, provide a consolidated summary
          focusing on:
          - Key points of the text
          - Characters if there is
          - Brief history of characters if there is
          - Sequence of events
  
          Respond in the language of the provided text.
  
          ${chunk}`,
        );
      subAnalyses.push(subAnalysis);
      totalUsage = this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const { analysis, usage } = await this.createFinalAnalysis(subAnalyses);
    return {
      analysis,
      usage: this.summarizeTokenUsage.sumTokenUsage(totalUsage, usage),
    };
  }
}
