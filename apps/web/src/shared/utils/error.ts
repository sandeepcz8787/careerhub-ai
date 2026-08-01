/**
 * Extract a user-friendly error message from any error shape.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') { return error; }

  if (error instanceof Error) { return error.message; }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>)['message'] === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Extract an error code from an API error.
 */
export function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as Record<string, unknown>)['code'] === 'string'
  ) {
    return (error as { code: string }).code;
  }
  return undefined;
}

/**
 * Check if an error is an auth error (to trigger logout).
 */
export function isAuthError(error: unknown): boolean {
  const code = getErrorCode(error);
  return code?.startsWith('AUTH_') ?? false;
}

/**
 * Check if an error is a network error (offline, timeout).
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    );
  }
  const status = (error as { status?: number })?.status;
  return status === 0 || status === undefined;
}
