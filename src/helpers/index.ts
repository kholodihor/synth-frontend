export const cutString = (str: string): string => {
  return str.split(' ').slice(0, 15).join(' ') + '...'
}

export const replaceUrl = (url: string): string => {
  return url.replace('watch?v=', 'embed/')
}

export const getFirstLetters = (name: string): string => {
  const words = name.split(' ')
  const firstLetters = words.map((word) => word.charAt(0).toUpperCase())
  return firstLetters.join('')
}

/**
 * Read a File as a base64 data URL (used for Cloudinary image uploads).
 */
export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
