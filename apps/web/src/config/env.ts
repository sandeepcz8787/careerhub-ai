import { z } from 'zod';

/**
 * Typed, validated environment variables for the frontend.
 * Vite exposes VITE_* vars via import.meta.env.
 */
const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
  VITE_APP_NAME: z.string().default('CareerHub AI'),
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
  VITE_SOCKET_URL: z.string().url().default('http://localhost:5000'),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

function validateEnv() {
  const result = envSchema.safeParse({
    ...import.meta.env,
    MODE: import.meta.env.MODE,
  });

  if (!result.success) {
    console.error('❌ Invalid environment configuration:', result.error.format());
    throw new Error('Invalid environment configuration. Check your .env.local file.');
  }

  return result.data;
}

export const env = validateEnv();
export const isDev = env.MODE === 'development';
export const isProd = env.MODE === 'production';
