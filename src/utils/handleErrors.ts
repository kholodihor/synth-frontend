/**
 * Utility function to handle and format error messages from API responses
 * Works with both Axios error messages and Effect-based API error responses
 * @param message - The error message to process
 * @returns Formatted user-friendly error message
 */
export const handleErrors = (message: string): string => {
  // Handle common Axios error messages
  if (message === 'Request failed with status code 404') {
    return 'Invalid email or password'
  }
  
  // Handle Effect-based error messages
  if (message.includes('Incorrect login or password')) {
    return 'Invalid email or password'
  }
  
  if (message.includes('User already exists')) {
    return 'This email is already registered'
  }
  
  if (message.includes('User not found')) {
    return 'User not found'
  }
  
  // Return the original message if no specific handling is defined
  return message
}
