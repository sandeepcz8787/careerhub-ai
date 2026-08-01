import type { ZodSchema, ZodError } from 'zod';
import type { ValidationErrorDetail } from '../types/api.types';

/**
 * Safely parse a Zod schema and return structured errors.
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: ValidationErrorDetail[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: formatZodErrors(result.error),
  };
}

/**
 * Format Zod errors into a flat array of field-level error details.
 */
export function formatZodErrors(error: ZodError): ValidationErrorDetail[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
}

/**
 * Check if value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if value is a valid email address.
 */
export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if value is a positive integer.
 */
export function isPositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Sanitize a string for safe display (remove HTML tags).
 */
export function sanitizeString(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}
