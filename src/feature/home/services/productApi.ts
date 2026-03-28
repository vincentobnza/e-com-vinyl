import { api } from '@/utils/axios'

export interface Product {
  id: string | number
  title: string
  artist: string
  price: number
  image?: string
  image_url?: string | null
  slug?: string
  description?: string | null
  stock?: number
  badges?: string[]
  tracks?: string[]
}

export interface AlbumDetailResponse {
  album: Product
  relatedAlbums: Product[]
}

export async function getAllAlbums(): Promise<Product[]> {
  const response = await api.get<Product[]>('/api/albums')
  return response.data
}

export async function getAlbumBySlug(slug: string): Promise<AlbumDetailResponse> {
  const response = await api.get<AlbumDetailResponse>(
    `/api/albums/by-slug/${encodeURIComponent(slug)}`,
  )
  return response.data
}
