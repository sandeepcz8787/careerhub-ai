import { z } from 'zod';

const urlSchema = z.string().url('Invalid URL').or(z.literal(''));

/** Update profile schema */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  headline: z.string().max(120, 'Headline must be under 120 characters').optional(),
  location: z.string().max(100, 'Location must be under 100 characters').optional(),
  website: urlSchema.optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(['linkedin', 'github', 'twitter', 'portfolio', 'other']),
        url: urlSchema,
      }),
    )
    .max(10, 'Maximum 10 social links')
    .optional(),
});

/** Pagination query schema */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().optional(),
});

// Inferred types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
