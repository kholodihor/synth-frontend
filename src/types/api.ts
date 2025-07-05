export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  message?: string;
  token?: string;
}

// Type guard for ApiError
export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'message' in error;
}
