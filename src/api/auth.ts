import { api } from '@/utils/axios'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  message: string
  user: User
  token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/api/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<LoginResponse>('/api/register', credentials),

  logout: () =>
    api.post('/api/logout'),

  getUser: () =>
    api.get<{ user: User }>('/api/user'),
}
