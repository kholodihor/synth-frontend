import { ref } from 'vue'
import axios from 'axios'
import { readFileAsDataUrl } from '@/helpers'

/**
 * Pick an image, preview it as a data URL and upload it to a Cloudinary-backed endpoint.
 */
export function useImageUpload(endpoint: '/api/uploadavatar' | '/api/uploadbandimage') {
  const preview = ref('')

  const select = async (file?: File | null) => {
    if (file) preview.value = await readFileAsDataUrl(file)
  }

  /** Uploads the selected image and returns its URL, or null if nothing was selected. */
  const upload = async (): Promise<string | null> => {
    if (!preview.value) return null
    const { data } = await axios.post<{ url: string }>(endpoint, { image: preview.value })
    return data.url
  }

  return { preview, select, upload }
}
