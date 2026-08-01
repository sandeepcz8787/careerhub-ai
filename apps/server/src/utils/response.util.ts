import type { Response } from 'express';

import type { ApiResponse, ApiErrorResponse, PaginationMeta } from '@careerhub/shared';
import { HttpStatus } from '../constants/http.constants';

/**
 * Send a standardized success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HttpStatus.OK,
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

/**
 * Send a standardized created response (201).
 */
export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, HttpStatus.CREATED);
}

/**
 * Send a standardized error response.
 */
export function sendError(
  res: Response,
  message: string,
  code: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: unknown,
): void {
  const response: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      details: details as ApiErrorResponse['error']['details'],
    },
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

/**
 * Send a standardized paginated list response.
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Success',
): void {
  res.status(HttpStatus.OK).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send a 204 No Content response.
 */
export function sendNoContent(res: Response): void {
  res.status(HttpStatus.NO_CONTENT).send();
}

/**
 * Build pagination meta from query params and total count.
 */
export function buildPaginationMeta(
  currentPage: number,
  limit: number,
  totalItems: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
