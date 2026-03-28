import { api } from '@/utils/axios'

export interface Album {
  id: string | number
  title: string
  artist: string
  price: string | number
  stock?: number
  image?: string | null
  image_url?: string | null
  description?: string | null
  slug?: string | null
  tracks?: string[]
  created_at?: string
  updated_at?: string
}

export interface AlbumsListParams {
  search?: string
  artist?: string
  price?: string
  page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const albumsApi = {
  list: (params?: AlbumsListParams) =>
    api.get<PaginatedResponse<Album>>('/api/albums', { params }),

  get: (id: number | string) =>
    api.get<Album>(`/api/albums/${id}`),

  create: (data: Omit<Album, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Album>('/api/albums', data),

  update: (id: number | string, data: Omit<Album, 'id' | 'created_at' | 'updated_at'>) =>
    api.put<Album>(`/api/albums/${id}`, data),

  delete: (id: number | string) =>
    api.delete(`/api/albums/${id}`),

  buy: (id: number | string) =>
    api.post(`/api/albums/${id}/buy`),

  restore: (id: number | string) =>
    api.post(`/api/albums/${id}/restore`),
}
