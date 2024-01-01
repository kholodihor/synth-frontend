export const handleErrors = (message: string) => {
  if (message === 'Request failed with status code 404') {
    return 'Invalid email or password'
  }
}
