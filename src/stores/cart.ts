import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { cartApi, type ServerCart } from "@/api/cart";
import { useAuthStore } from "@/stores/auth";
import { slugify } from "@/helpers/slug";
import { toast } from "@/shared/lib/toast";

const STORAGE_KEY = "ecom_cart";

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

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is CartLine =>
        row &&
        typeof row === "object" &&
        typeof (row as CartLine).albumId === "string" &&
        typeof (row as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
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
  const items = ref<CartLine[]>(loadLines());
  const serverTotals = ref<CartTotals | null>(null);
  const syncing = ref(false);

  const authStore = useAuthStore();

  function persistGuestCart() {
    if (!authStore.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
    }
  }

  watch(
    items,
    () => {
      persistGuestCart();
    },
    { deep: true },
  );

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

  async function pullCartFromApi() {
    const { data } = await cartApi.get();
    applyServerCart(data.cart);
  }

  async function hydrateFromApi() {
    if (!authStore.isAuthenticated) return;
    syncing.value = true;
    try {
      await pullCartFromApi();
    } catch {
      /* session may be invalid */
    } finally {
      syncing.value = false;
    }
  }

  watch(
    () => authStore.isAuthenticated,
    async (loggedIn) => {
      if (loggedIn) {
        syncing.value = true;
        try {
          const guest = loadLines();
          if (guest.length) {
            for (const line of guest) {
              try {
                await cartApi.addItem(line.albumId, line.quantity);
              } catch {
                /* skip line e.g. stock */
              }
            }
            localStorage.removeItem(STORAGE_KEY);
          }
          await pullCartFromApi();
        } catch {
          /* network */
        } finally {
          syncing.value = false;
        }
      } else {
        serverTotals.value = null;
        items.value = loadLines();
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

  function addLocalItem(line: Omit<CartLine, "quantity"> & { quantity: number }) {
    const cap = line.maxStock > 0 ? line.maxStock : 99;
    const qty = Math.min(Math.max(1, line.quantity), cap);
    const existing = items.value.find((i) => i.albumId === line.albumId);
    if (existing) {
      const existingCap = existing.maxStock > 0 ? existing.maxStock : 99;
      existing.quantity = Math.min(existing.quantity + qty, existingCap);
      existing.price = line.price;
      existing.slug = line.slug;
      existing.image = line.image;
      existing.title = line.title;
      existing.artist = line.artist;
      existing.maxStock = line.maxStock;
    } else {
      items.value.push({
        albumId: line.albumId,
        title: line.title,
        artist: line.artist,
        price: line.price,
        slug: line.slug,
        image: line.image,
        maxStock: line.maxStock,
        quantity: qty,
      });
    }
  }

  function removeLocalItem(albumId: string) {
    items.value = items.value.filter((i) => i.albumId !== albumId);
    toast.info("Item removed from cart");
  }

  async function addItem(
    line: Omit<CartLine, "quantity"> & { quantity: number },
  ): Promise<void> {
    if (authStore.isAuthenticated) {
      syncing.value = true;
      try {
        const { data } = await cartApi.addItem(line.albumId, line.quantity);
        applyServerCart(data.cart);
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Could not add to cart";
        toast.error(msg);
        throw e;
      } finally {
        syncing.value = false;
      }
    } else {
      addLocalItem(line);
    }
  }

  async function setQuantity(albumId: string, quantity: number): Promise<void> {
    if (authStore.isAuthenticated) {
      syncing.value = true;
      try {
        const { data } = await cartApi.updateItem(albumId, quantity);
        applyServerCart(data.cart);
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Could not update cart";
        toast.error(msg);
        throw e;
      } finally {
        syncing.value = false;
      }
    } else {
      const line = items.value.find((i) => i.albumId === albumId);
      if (!line) return;
      if (quantity <= 0) {
        removeLocalItem(albumId);
        return;
      }
      const cap = line.maxStock > 0 ? line.maxStock : 99;
      line.quantity = Math.min(quantity, cap);
    }
  }

  async function removeItem(albumId: string): Promise<void> {
    if (authStore.isAuthenticated) {
      syncing.value = true;
      try {
        const { data } = await cartApi.removeItem(albumId);
        applyServerCart(data.cart);
      } catch {
        toast.error("Could not remove item");
      } finally {
        syncing.value = false;
      }
    } else {
      removeLocalItem(albumId);
    }
  }

  async function clear(): Promise<void> {
    if (authStore.isAuthenticated) {
      syncing.value = true;
      try {
        const { data } = await cartApi.clear();
        applyServerCart(data.cart);
      } finally {
        syncing.value = false;
      }
    } else {
      items.value = [];
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
