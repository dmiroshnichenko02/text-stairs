import {
  BadRequestException,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { TokenUsage } from './utils/summarizeTokenUsage';

@ApiTags('Book Analysis')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('books')
export class AiController {
  constructor(private readonly bookAnalysisService: AiService) {}

  @Post('analyze')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Analyze a PDF book',
    description:
      'Upload and analyze a PDF book based on your current plan limits',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF book file to analyze',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Book successfully analyzed',
    schema: {
      type: 'object',
      properties: {
        bookId: {
          type: 'number',
          description: 'ID of the analyzed book',
        },
        pageCount: {
          type: 'number',
          description: 'Total number of pages in the book',
        },
        chunkAnalyses: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Analysis results for each chunk of the book',
        },
        finalAnalysis: {
          type: 'string',
          description: 'Comprehensive analysis of the entire book',
        },
        tokenUsage: {
          type: 'object',
          properties: {
            prompt_tokens: {
              type: 'number',
              description: 'Number of tokens used in prompts',
            },
            completion_tokens: {
              type: 'number',
              description: 'Number of tokens in completions',
            },
            total_tokens: {
              type: 'number',
              description: 'Total number of tokens used',
            },
          },
          description: 'Token usage statistics for the analysis',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input, file size exceeds plan limit, or processing error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid authentication required',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable file or exceeded plan limits',
  })
  async analyzeBook(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<{
    bookId: number;
    pageCount: number;
    chunkAnalyses: string[];
    finalAnalysis: string;
    tokenUsage: TokenUsage;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.bookAnalysisService.analyzeBook(file, 1);
  }

  @Post('short-summary')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Short summary of a PDF book', // Краткое описание для пользователе
    description: 'Upload a PDF book and receive a concise summary of it', // Описание задачи
  })
  @ApiConsumes('multipart/form-data') // Указывает на тип данных в запросе (мультичасти)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The PDF file that will be analyzed and summarized', // Описание поля
        },
      },
    },
  })
  @ApiResponse({
    status: 201, // Статус успешного ответа
    description: 'Book successfully summarized', // Описание успешного результата
    schema: {
      type: 'object',
      properties: {
        bookId: {
          type: 'number',
          description: 'ID of the summarized book', // ID обработанной книги
        },
        pageCount: {
          type: 'number',
          description: 'Total number of pages in the book', // Общее количество страниц
        },
        chunkSummaries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Summaries for each chunk of the book', // Резюме для каждой части книги
        },
        finalSummary: {
          type: 'string',
          description: 'Final summary of the entire book', // Итоговое резюме
        },
        tokenUsage: {
          type: 'object',
          properties: {
            prompt_tokens: {
              type: 'number',
              description: 'Tokens used in prompts', // Количество токенов на запрос
            },
            completion_tokens: {
              type: 'number',
              description: 'Tokens used for completions', // Количество токенов на вывод
            },
            total_tokens: {
              type: 'number',
              description: 'Total tokens used in the summarization', // Общий расход токенов
            },
          },
          description: 'Token usage details for the summarization process', // Статистика использования токенов
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: file is not provided or other errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: valid authentication is required',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable entity or file exceeds allowed limits',
  })
  async shortSummarize(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<{
    bookId: number;
    pageCount: number;
    chunkSummaries: string[];
    finalSummary: string;
    tokenUsage: TokenUsage;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.bookAnalysisService.shortSummarizeBook(file, 1);
  }

  @Post('characters-quotes')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Short summary of a PDF book', // Краткое описание для пользователе
    description: 'Upload a PDF book and receive a concise summary of it', // Описание задачи
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'The PDF file that will be analyzed and characters quotes', // Описание поля
        },
      },
    },
  })
  @ApiResponse({
    status: 201, // Статус успешного ответа
    description: 'Book successfully characters quotes', // Описание успешного результата
    schema: {
      type: 'object',
      properties: {
        bookId: {
          type: 'number',
          description: 'ID of the characters quotes book', // ID обработанной книги
        },
        pageCount: {
          type: 'number',
          description: 'Total number of pages in the book', // Общее количество страниц
        },
        chunkSummaries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Characters quotes for each chunk of the book', // Резюме для каждой части книги
        },
        finalSummary: {
          type: 'string',
          description: 'Final summary of the entire book', // Итоговое резюме
        },
        tokenUsage: {
          type: 'object',
          properties: {
            prompt_tokens: {
              type: 'number',
              description: 'Tokens used in prompts', // Количество токенов на запрос
            },
            completion_tokens: {
              type: 'number',
              description: 'Tokens used for completions', // Количество токенов на вывод
            },
            total_tokens: {
              type: 'number',
              description: 'Total tokens used in the summarization', // Общий расход токенов
            },
          },
          description: 'Token usage details for the summarization process', // Статистика использования токенов
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: file is not provided or other errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: valid authentication is required',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable entity or file exceeds allowed limits',
  })
  async literatureQuoteCharacters(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<{
    bookId: number;
    pageCount: number;
    chunkSummaries: string[];
    finalSummary: string;
    tokenUsage: TokenUsage;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.bookAnalysisService.charactersQuotes(file, 1);
  }
}
