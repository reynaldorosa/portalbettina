import { z } from 'zod';

const envSchema = z.object({
  VITE_DEEPSEEK_API_KEY: z.string().min(1, 'DeepSeek API key is required'),
  VITE_DEEPSEEK_API_URL: z.string().url().default('https://api.deepseek.com/v1'),
  VITE_DEEPSEEK_MODEL: z.string().default('deepseek-chat'),
  VITE_DEEPSEEK_MAX_TOKENS: z.coerce.number().default(2048),
  VITE_DEEPSEEK_TEMPERATURE: z.coerce.number().default(0.7),
  VITE_API_TIMEOUT: z.coerce.number().default(15000),
  VITE_API_RETRY_ATTEMPTS: z.coerce.number().default(3),
  VITE_DEEPSEEK_RETRY_DELAY_MS: z.coerce.number().default(2000),
  VITE_DEEPSEEK_FALLBACK_ENABLED: z.coerce.boolean().default(true),
  VITE_CACHE_TTL: z.coerce.number().default(3600)
});

const env = envSchema.parse(import.meta.env);

export const DEEPSEEK_CONFIG = {
  API_KEY: env.VITE_DEEPSEEK_API_KEY,
  API_URL: env.VITE_DEEPSEEK_API_URL,
  MODEL: env.VITE_DEEPSEEK_MODEL,
  MAX_TOKENS: env.VITE_DEEPSEEK_MAX_TOKENS,
  TEMPERATURE: env.VITE_DEEPSEEK_TEMPERATURE,
  TIMEOUT_MS: env.VITE_API_TIMEOUT,
  MAX_RETRIES: env.VITE_API_RETRY_ATTEMPTS,
  RETRY_DELAY_MS: env.VITE_DEEPSEEK_RETRY_DELAY_MS,
  FALLBACK_ENABLED: env.VITE_DEEPSEEK_FALLBACK_ENABLED,
  CACHE_TTL_MS: env.VITE_CACHE_TTL * 1000
};

export const REPORT_CONFIG = {
  TYPES: {
    COMPREHENSIVE: 'comprehensive',
    COGNITIVE: 'cognitive',
    BEHAVIORAL: 'behavioral',
    COMPARISON: 'comparison'
  },
  TYPE_NAMES: {
    comprehensive: 'Relatório Completo',
    cognitive: 'Foco Cognitivo',
    behavioral: 'Padrões Comportamentais',
    comparison: 'Comparação Populacional'
  }
};

export default {
  DEEPSEEK_CONFIG,
  REPORT_CONFIG
};