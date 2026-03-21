import { api } from '@/utils/axios'

export interface Product {
  id: string | number
  title: string
  artist: string
  price: number
  image?: string
  badges?: string[]
  tracks?: string[]
}

export async function getAllAlbums(): Promise<Product[]> {
  const response = await api.get<Product[]>('/api/albums')
  return response.data
}

