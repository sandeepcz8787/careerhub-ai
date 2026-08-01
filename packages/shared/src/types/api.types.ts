import type { PaginationParams } from './common.types';

/** Standardized API success response envelope */
export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
  timestamp: string;
}

/** Standardized API error response envelope */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: Record<string, string[]> | string;
  };
  timestamp: string;
}

/** Paginated response envelope */
export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Generic API meta */
export interface ApiMeta {
  requestId?: string;
  [key: string]: unknown;
}

/** API query parameters */
export interface ApiQueryParams extends Partial<PaginationParams> {
  search?: string;
  [key: string]: unknown;
}

/** HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Validation error detail (from Zod) */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}
