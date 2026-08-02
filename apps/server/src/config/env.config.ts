import { z } from 'zod';

/**
 * Typed environment configuration.
 * Validates all required env vars on startup — fails fast with clear error messages.
 */
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1024).max(65535).default(5000),
  APP_NAME: z.string().default('CareerHub AI'),
  APP_URL: z.string().url().default('http://localhost:5000'),
  SERVER_URL: z.string().url().default('http://localhost:5000'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  ALLOWED_ORIGINS: z
    .string()
    .transform((val) => val.split(',').map((s) => s.trim()))
    .default('http://localhost:5173'),

  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters').default('super_secret_access_token_jwt_key_careerhub_ai_32chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters').default('super_secret_refresh_token_jwt_key_careerhub_ai_32chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().default('demo_cloud'),
  CLOUDINARY_API_KEY: z.string().default('demo_key'),
  CLOUDINARY_API_SECRET: z.string().default('demo_secret'),

  // Nodemailer & Email Service Strategy
  EMAIL_PROVIDER: z.enum(['smtp', 'brevo']).default('smtp'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.string().transform((v) => v === 'true').default('false'),
  SMTP_USER: z.string().default('noreply@careerhub.ai'),
  SMTP_PASS: z.string().optional(),
  SMTP_PASSWORD: z.string().default('placeholder_smtp_pass'),
  BREVO_API_KEY: z.string().optional(),
  EMAIL_FROM_NAME: z.string().default('CareerHub AI'),
  EMAIL_FROM_ADDRESS: z.string().default('noreply@careerhub.ai'),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CALLBACK_URL: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),

  // AI Integration
  GEMINI_API_KEY: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('debug'),
  LOG_DIR: z.string().default('logs'),

  // Cookie
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be at least 32 characters').default('super_secret_cookie_key_careerhub_ai_32chars'),
  COOKIE_SECURE: z.string().transform((v) => v === 'true').default('false'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('\n❌ Invalid environment configuration:');
    result.error.errors.forEach((err) => {
      console.error(`   • ${err.path.join('.')}: ${err.message}`);
    });
    console.error('\nPlease check your .env file against .env.example\n');
    process.exit(1);
  }
  return result.data;
}

export const env = validateEnv();
export type Env = typeof env;
