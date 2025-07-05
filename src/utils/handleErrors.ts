interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export const handleErrors = (error: string | Error | ErrorResponse): string => {
  // Handle string errors
  if (typeof error === 'string') {
    if (error.includes('404')) return 'The requested resource was not found.'
    if (error.includes('401')) return 'Unauthorized. Please log in again.'
    if (error.includes('403')) return 'You do not have permission to perform this action.'
    if (error.includes('Network Error')) return 'Unable to connect to the server. Please check your internet connection.'
    return error || 'An unknown error occurred.'
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.'
  }
  
  // Handle ErrorResponse objects
  if (typeof error === 'object' && error !== null) {
    if (error.message) return error.message
    if (error.error) return error.error
    if (error.statusCode === 404) return 'The requested resource was not found.'
    if (error.statusCode === 401) return 'Unauthorized. Please log in again.'
    if (error.statusCode === 403) return 'You do not have permission to perform this action.'
    
    // Handle validation errors
    if (error.errors) {
      const errorMessages = Object.values(error.errors).flat()
      return errorMessages.join(' ') || 'Validation failed.'
    }
  }
  
  // Fallback for any other case
  return 'An unknown error occurred.'
}
