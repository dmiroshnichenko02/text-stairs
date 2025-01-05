import { Injectable } from '@nestjs/common';

export interface AnalysisPoint {
  key: string;
  required?: boolean;
  onlyForLiterature?: boolean;
}

export interface PromptConfig {
  analysisPoints: AnalysisPoint[];
  includePartInfo?: boolean;
  skipEmpty?: boolean;
  isLiterature?: boolean;
  additionalInstructions?: string[];
}

@Injectable()
export class PromptGenerationService {
  generateChunkPrompt(
    config: PromptConfig,
    chunkText: string,
    partInfo?: { current: number; total: number },
  ): string {
    const parts: string[] = [];

    if (config.includePartInfo && partInfo) {
      parts.push(
        `Analyze this portion of the text (Part ${partInfo.current} of ${partInfo.total}):`,
      );
    }

    if (config.analysisPoints.length > 0) {
      const filteredPoints = config.analysisPoints.filter(
        (point) => !point.onlyForLiterature || config.isLiterature,
      );

      const points = filteredPoints.map((point) => `- ${point.key}`);
      parts.push(points.join('\n'));
    }

    if (config.skipEmpty) {
      parts.push('Skip points that are not present in the text.');
    }

    if (config.additionalInstructions?.length > 0) {
      parts.push(...config.additionalInstructions);
    }

    parts.push(`Text: ${chunkText}`);

    return parts.join('\n\n');
  }

  generateFinalPrompt(
    config: PromptConfig,
    combinedAnalysis: string,
    isSubAnalysis: boolean = false,
  ): string {
    const parts: string[] = [];

    const intro = isSubAnalysis
      ? 'Based on the following portion of analyses, provide a consolidated summary focusing on:'
      : 'Based on the following analyses of different parts of the book, provide a comprehensive analysis of the entire work. Include:';

    parts.push(intro);

    if (config.analysisPoints.length > 0) {
      const filteredPoints = config.analysisPoints.filter(
        (point) => !point.onlyForLiterature || config.isLiterature,
      );

      const points = filteredPoints.map((point) => `- ${point.key}`);
      parts.push(points.join('\n'));
    }

    if (config.skipEmpty) {
      parts.push('Skip points that are not present in the text.');
    }

    if (config.additionalInstructions?.length > 0) {
      parts.push(...config.additionalInstructions);
    }

    parts.push('Individual analyses:', combinedAnalysis);

    return parts.join('\n\n');
  }
}

export const PROMPT_CONFIGS = {
  FULL_ANALYSIS: {
    analysisPoints: [
      {
        key: 'Key points of the text',
        required: true,
      },
      {
        key: 'Characters (if present)',
        onlyForLiterature: true,
      },
      {
        key: 'Brief history of characters (if present)',
        onlyForLiterature: true,
      },
      {
        key: 'Sequence of events',
        required: true,
      },
      {
        key: 'Genre of the work',
        onlyForLiterature: true,
      },
      {
        key: 'Stylistic features',
        onlyForLiterature: true,
      },
      {
        key: 'Main theme of the text',
      },
      {
        key: 'Idea of the text',
      },
      {
        key: 'Problematic or key issues that are addressed',
      },
      {
        key: 'What the text is about',
      },
    ],
    includePartInfo: true,
    skipEmpty: true,
    isLiterature: false,
  } satisfies PromptConfig,

  SHORT_ANALYSIS: {
    analysisPoints: [
      {
        key: 'Key points of the text',
        required: true,
      },
      {
        key: 'Characters (if present)',
        onlyForLiterature: true,
      },
      {
        key: 'Brief history of characters (if present)',
        onlyForLiterature: true,
      },
      {
        key: 'Sequence of events',
        required: true,
      },
    ],
    includePartInfo: true,
    skipEmpty: true,
    isLiterature: false,
  } satisfies PromptConfig,

  LITERATURE_CHARACTER_QUOTES: {
    analysisPoints: [
      {
        key: 'Extract and list all uniquely named characters from the text. Include only characters that are explicitly named or clearly referenced.',
        required: true,
      },
      {
        key: 'For each character, provide ONLY direct quotes from the text that show their personality traits. Each quote must be enclosed in quotation marks and followed by context (page number or chapter if available).',
        required: true,
      },
      {
        key: 'Extract ONLY actual text passages that show relationships between characters. Each passage must be a direct quote from the text, with clear indication of which characters are involved.',
        required: true,
      },
      {
        key: 'If character development is present, provide chronological quotes from the text that demonstrate how the character changes over time. Include only quotes that show clear evolution of the character.',
      },
      {
        key: "Extract significant dialogue exchanges between characters, copying the exact text. Each dialogue must be preceded by the speaking characters' names and include surrounding context.",
      },
    ],
    includePartInfo: true,
    skipEmpty: true,
    isLiterature: true,
    additionalInstructions: [
      'IMPORTANT: Do NOT generate or create any artificial quotes or dialogues.',
      'IMPORTANT: Do NOT include any quotes that are not directly present in the source text.',
      'IMPORTANT: Do NOT summarize or paraphrase - use only exact quotes from the text.',
      'Format each quote exactly as it appears in the text, preserving original punctuation and formatting.',
      'For each quote, specify its location in the text (chapter, page, or paragraph reference if available).',
      'If a particular analysis point yields no direct quotes from the text, mark it as "No relevant quotes found in the text" rather than generating content.',
      'Ensure each character mentioned in the analysis appears in the actual text.',
      'When extracting character interactions, include only interactions that are explicitly described in the text.',
      'If multiple variations or interpretations of a character name exist, group them together and provide textual evidence for the connection.',
      'Ignore character mentions that are repetitive or lack meaningful context.',
      'For each quote, provide brief factual context about when and where it occurs in the story, if available in the text.',
    ],
  } satisfies PromptConfig,

  TEXT_QUESTIONS: {
    analysisPoints: [
      {
        key: 'Generate factual questions (5-6) about specific events and details. For each question provide:\n- Question\n- Direct answer from the text\n- Include quote only if the question is specifically about a quote',
        required: true,
      },
      {
        key: 'Create analytical questions (4-5) about character motivations, themes, and plot developments. For each question provide:\n- Question\n- Detailed answer based on text analysis\n- Include quote only if directly analyzing specific text passages',
        required: true,
      },
      {
        key: 'Form discussion questions (2-3) that connect to broader themes. For each question provide:\n- Question\n- Suggested answer direction',
        required: true,
      },
    ],
    includePartInfo: true,
    skipEmpty: false,
    isLiterature: true,
    additionalInstructions: [
      'Format each Q&A simply as:\nQ: [Question]\nA: [Answer]',
      'Only include quotes if they are specifically being analyzed or discussed in the question',
      'Answers should be clear and complete',
      'Questions should progress from simple facts to complex analysis',
      'For the final summary, select the most insightful Q&As from each section',
      'Focus on understanding the text rather than citing specific chapters or sections',
    ],
  } satisfies PromptConfig,
} as const;
