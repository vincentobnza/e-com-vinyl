import { api } from "@/utils/axios";

export interface ServerCartItem {
  album_id: string;
  quantity: number;
  price: number;
  title: string;
  artist: string;
  slug?: string | null;
  image?: string | null;
  stock?: number;
}

export interface ServerCart {
  id: number;
  items: ServerCartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export const cartApi = {
  get: () => api.get<{ cart: ServerCart }>("/api/cart"),

  addItem: (albumId: string, quantity: number) =>
    api.post<{ cart: ServerCart }>("/api/cart/items", {
      album_id: albumId,
      quantity,
    }),

  updateItem: (albumId: string, quantity: number) =>
    api.patch<{ cart: ServerCart }>("/api/cart/items", {
      album_id: albumId,
      quantity,
    }),

  removeItem: (albumId: string) =>
    api.delete<{ cart: ServerCart }>("/api/cart/items", {
      data: { album_id: albumId },
    }),

  clear: () => api.delete<{ cart: ServerCart }>("/api/cart"),

  merge: (guestKey: string) =>
    api.post<{ cart: ServerCart }>("/api/cart/merge", { guest_key: guestKey }),
};
