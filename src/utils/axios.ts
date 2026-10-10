import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL

// Read the token on every request so login/logout take effect immediately
axios.interceptors.request.use((config) => {
  const { token } = useUserStore()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// An expired or invalid token means the persisted session is stale
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const userStore = useUserStore()
      if (userStore.token) userStore.logout()
    }
    return Promise.reject(error)
  }
)
