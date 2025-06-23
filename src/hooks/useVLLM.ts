import { useState } from 'react';
import { VLLMRequest, vllmService } from '../lib/vllm';

interface UseVLLMResult {
  response: string | null;
  loading: boolean;
  error: string | null;
  generate: (prompt: string, context?: string, options?: Partial<VLLMRequest>) => Promise<void>;
}

export function useVLLM(): UseVLLMResult {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (
    prompt: string,
    context?: string,
    options: Partial<VLLMRequest> = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let result: string;
      if (context) {
        result = await vllmService.generateWithContext(prompt, context, options);
      } else {
        const response = await vllmService.generateResponse({
          prompt,
          ...options
        });
        result = response.text;
      }
      
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating response');
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    loading,
    error,
    generate
  };
}
