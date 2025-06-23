import axios from 'axios';

export interface VLLMRequest {
  prompt: string;
  context?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface VLLMResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const VLLM_ENDPOINT = process.env.VLLM_ENDPOINT || 'http://localhost:8081/v1/generate';

export class VLLMService {
  private static instance: VLLMService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = VLLM_ENDPOINT;
  }

  public static getInstance(): VLLMService {
    if (!VLLMService.instance) {
      VLLMService.instance = new VLLMService();
    }
    return VLLMService.instance;
  }

  async generateResponse(request: VLLMRequest): Promise<VLLMResponse> {
    try {
      const response = await axios.post<VLLMResponse>(this.baseUrl, {
        ...request,
        max_tokens: request.max_tokens || 1024,
        temperature: request.temperature || 0.7,
        top_p: request.top_p || 0.95,
        stream: request.stream || false
      });

      return response.data;
    } catch (error) {
      console.error('Error generating VLLM response:', error);
      throw new Error('Failed to generate response from VLLM service');
    }
  }

  async generateWithContext(
    prompt: string,
    context: string,
    options: Partial<VLLMRequest> = {}
  ): Promise<string> {
    try {
      const fullPrompt = `Context: ${context}\n\nQuestion: ${prompt}\n\nAnswer:`;
      const response = await this.generateResponse({
        prompt: fullPrompt,
        ...options
      });
      return response.text;
    } catch (error) {
      console.error('Error generating response with context:', error);
      throw new Error('Failed to generate response with context');
    }
  }
}

export const vllmService = VLLMService.getInstance();
