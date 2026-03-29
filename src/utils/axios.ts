import axios from 'axios'
import { getStoredToken } from '@/utils/authStorage'
import { ensureGuestCartKey } from '@/utils/guestCartKey'

/** In dev, leave `VITE_API_URL` empty to use the Vite proxy (`/api` → Laravel) and avoid cross-origin issues. */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    delete config.headers['X-Guest-Cart-Key']
  } else {
    config.headers['X-Guest-Cart-Key'] = ensureGuestCartKey()
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  }
)

export { api }

