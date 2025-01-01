import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { TokenUsage } from './summarizeTokenUsage';

export class MakeApiRequest {
  private readonly API_URL = 'https://api.together.ai/v1/chat/completions';
  private readonly MODEL = 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo';

  async makeApiRequest(
    prompt: string,
  ): Promise<{ content: string; usage: TokenUsage }> {
    try {
      const { data } = await axios.post(
        this.API_URL,
        {
          model: this.MODEL,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      };
    } catch (error) {
      console.error('API Error:', error);
      throw new BadRequestException(
        'Failed to process with ML API: ' + error.message,
      );
    }
  }
}
