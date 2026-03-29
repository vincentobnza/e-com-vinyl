import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { cartApi, type ServerCart } from "@/api/cart";
import { getApiErrorMessage } from "@/utils/apiError";
import { getGuestCartKey, regenerateGuestCartKey } from "@/utils/guestCartKey";
import { useAuthStore } from "@/stores/auth";
import { slugify } from "@/helpers/slug";
import { toast } from "@/shared/lib/toast";

export interface CartLine {
  albumId: string;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  slug: string;
  image?: string;
  maxStock: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

function serverCartToLines(cart: ServerCart): CartLine[] {
  return cart.items.map((item) => ({
    albumId: item.album_id,
    title: item.title,
    artist: item.artist,
    price: item.price,
    quantity: item.quantity,
    slug: item.slug ?? slugify(item.title),
    image: item.image ?? undefined,
    maxStock: item.stock != null && item.stock >= 0 ? item.stock : 99,
  }));
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartLine[]>([]);
  const serverTotals = ref<CartTotals | null>(null);
  const syncing = ref(false);

  const authStore = useAuthStore();

  function applyServerCart(cart: ServerCart) {
    items.value = serverCartToLines(cart);
    serverTotals.value = {
      subtotal: cart.subtotal,
      discount: cart.discount,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
    };
  }

  async function pullCartFromApi(): Promise<void> {
    const { data } = await cartApi.get();
    applyServerCart(data.cart);
  }

  async function hydrateFromApi(): Promise<void> {
    syncing.value = true;
    try {
      await pullCartFromApi();
    } catch {
      items.value = [];
      serverTotals.value = null;
    } finally {
      syncing.value = false;
    }
  }

  watch(
    () => [authStore.isHydrated, authStore.isAuthenticated] as const,
    async ([hydrated, loggedIn], prev) => {
      if (!hydrated) return;

      const wasLoggedIn = prev?.[1] === true;

      syncing.value = true;
      try {
        if (loggedIn) {
          const guestKey = getGuestCartKey();
          if (guestKey) {
            try {
              const { data } = await cartApi.merge(guestKey);
              applyServerCart(data.cart);
            } catch {
              await pullCartFromApi();
            }
            regenerateGuestCartKey();
          } else {
            await pullCartFromApi();
          }
        } else {
          if (wasLoggedIn) {
            regenerateGuestCartKey();
          }
          await pullCartFromApi();
        }
      } catch {
        items.value = [];
        serverTotals.value = null;
      } finally {
        syncing.value = false;
      }
    },
    { immediate: true },
  );

  const itemCount = computed(() =>
    items.value.reduce((sum, line) => sum + line.quantity, 0),
  );

  const localMerchandiseTotal = computed(() =>
    items.value.reduce((sum, line) => sum + line.price * line.quantity, 0),
  );

  const subtotal = computed(() =>
    serverTotals.value != null
      ? serverTotals.value.subtotal
      : localMerchandiseTotal.value,
  );

  const grandTotal = computed(() =>
    serverTotals.value != null ? serverTotals.value.total : localMerchandiseTotal.value,
  );

  async function addItem(
    line: Omit<CartLine, "quantity"> & { quantity: number },
  ): Promise<void> {
    syncing.value = true;
    try {
      const { data } = await cartApi.addItem(line.albumId, line.quantity);
      applyServerCart(data.cart);
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e, "Could not add to cart"));
      throw e;
    } finally {
      syncing.value = false;
    }
  }

  async function setQuantity(albumId: string, quantity: number): Promise<void> {
    syncing.value = true;
    try {
      const { data } = await cartApi.updateItem(albumId, quantity);
      applyServerCart(data.cart);
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e, "Could not update cart"));
      throw e;
    } finally {
      syncing.value = false;
    }
  }

  async function removeItem(albumId: string): Promise<void> {
    syncing.value = true;
    try {
      const { data } = await cartApi.removeItem(albumId);
      applyServerCart(data.cart);
      toast.info("Item removed from cart");
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e, "Could not remove item"));
    } finally {
      syncing.value = false;
    }
  }

  async function clear(): Promise<void> {
    syncing.value = true;
    try {
      const { data } = await cartApi.clear();
      applyServerCart(data.cart);
    } finally {
      syncing.value = false;
    }
  }

  return {
    items,
    serverTotals,
    syncing,
    itemCount,
    subtotal,
    grandTotal,
    localMerchandiseTotal,
    addItem,
    setQuantity,
    removeItem,
    clear,
    hydrateFromApi,
  };
});
