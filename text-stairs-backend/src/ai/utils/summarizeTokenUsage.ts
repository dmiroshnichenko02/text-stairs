export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export class SummarizeTokenUsage {
  sumTokenUsage(usage1: TokenUsage, usage2: TokenUsage): TokenUsage {
    return {
      prompt_tokens: usage1.prompt_tokens + usage2.prompt_tokens,
      completion_tokens: usage1.completion_tokens + usage2.completion_tokens,
      total_tokens: usage1.total_tokens + usage2.total_tokens,
    };
  }
}
