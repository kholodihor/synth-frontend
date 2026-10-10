import axios from 'axios'
import Swal from './swal'

const CONFIRM_COLOR = '#219dff'

/**
 * Extract a user-facing message from an API (axios) error or any thrown value.
 */
export const getErrorMessage = (
  error: unknown,
  fallback = 'An unexpected error occurred'
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message
  }
  return error instanceof Error ? error.message : fallback
}

export const notifyError = (title: string, error: unknown) =>
  Swal.fire({
    title,
    text: getErrorMessage(error),
    icon: 'error',
    confirmButtonColor: CONFIRM_COLOR
  })

export const notifySuccess = (title: string, text?: string) =>
  Swal.fire({ title, text, icon: 'success', confirmButtonColor: CONFIRM_COLOR })

export const notifyInvalidForm = () =>
  Swal.fire({
    title: 'Something went wrong!',
    text: "You didn't fill in all required fields or some inputs are invalid",
    icon: 'warning',
    confirmButtonColor: CONFIRM_COLOR
  })

export const confirmDanger = async (title: string, text = "You won't be able to revert this!") => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, please!',
    confirmButtonColor: '#29fd53',
    cancelButtonColor: 'red'
  })
  return result.isConfirmed
}
