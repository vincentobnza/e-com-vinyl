<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { HomeHeader, HomeFooter, ProductCard, ProductGrid } from "@/feature/home/components";
import { UiSpinner } from "@/shared/components/ui";
import { CatalogLayout } from "@/feature/home/layouts";
import { getAlbumBySlug, type Product } from "@/feature/home/services/productApi";
import { useQuery } from "@tanstack/vue-query";
import { slugify } from "@/helpers/slug";
import { useCartStore } from "@/stores/cart";
import { toast } from "@/shared/lib/toast";

defineOptions({ name: "ProductDetailPage" });

const cartStore = useCartStore();
const router = useRouter();

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

const {
  data: detail,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["album", slug],
  queryFn: () => getAlbumBySlug(slug.value),
  enabled: computed(() => Boolean(slug.value)),
});

const album = computed(() => detail.value?.album);
const relatedAlbums = computed<Product[]>(() => detail.value?.relatedAlbums ?? []);

const coverSrc = computed(() => {
  const a = album.value;
  if (!a) return undefined;
  return a.image_url ?? a.image;
});

const trackList = computed(() => album.value?.tracks ?? []);

function isNotFoundError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in e &&
    (e as { response?: { status?: number } }).response?.status === 404
  );
}

const isNotFound = computed(() => isError.value && isNotFoundError(error.value));

const quantity = ref(1);

const maxQty = computed(() => {
  const stock = album.value?.stock;
  if (stock === undefined || stock < 0) return 99;
  return stock;
});

const inStock = computed(() => maxQty.value > 0);

watch(
  () => [album.value?.id, maxQty.value] as const,
  () => {
    if (maxQty.value <= 0) {
      quantity.value = 0;
      return;
    }
    quantity.value = Math.min(Math.max(1, quantity.value), maxQty.value);
  },
);

function decreaseQty() {
  if (quantity.value > 1) quantity.value -= 1;
}

function increaseQty() {
  if (quantity.value < maxQty.value) quantity.value += 1;
}

async function addToCart() {
  if (!album.value || !inStock.value) return;
  try {
    await cartStore.addItem({
      albumId: String(album.value.id),
      title: album.value.title,
      artist: album.value.artist,
      price: Number(album.value.price),
      quantity: quantity.value,
      slug: album.value.slug ?? slugify(album.value.title),
      image: album.value.image_url ?? album.value.image ?? undefined,
      maxStock: maxQty.value,
    });
    toast.success("Added to cart", {
      description: `${quantity.value} × ${album.value.title}`,
      action: {
        label: "View cart",
        onClick: () => {
          router.push("/cart");
        },
      },
    });
  } catch {
    /* validation / stock errors are toasted in the cart store */
  }
}

function buyWithShop() {
  if (!album.value || !inStock.value) return;
  toast.info("Express checkout isn’t connected yet.", {
    description: "Use Add to cart and checkout when available.",
  });
}
</script>

<template>
  <main class="flex min-h-screen flex-col bg-background">
    <HomeHeader />
    <CatalogLayout>
      <template #content>
        <div class="space-y-8">
          <nav class="text-sm text-neutral-500" aria-label="Breadcrumb">
            <RouterLink to="/" class="hover:text-primary">Home</RouterLink>
            <span class="mx-2" aria-hidden="true">/</span>
            <RouterLink to="/products" class="hover:text-primary">Products</RouterLink>
            <span class="mx-2" aria-hidden="true">/</span>
            <span class="text-primary">{{ album?.title ?? "Album" }}</span>
          </nav>

          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center min-h-[50vh] gap-8 text-neutral-900"
            role="status"
            aria-live="polite"
          >
            <UiSpinner class="text-primary" />
            <span class="text-sm md:text-lg font-semibold">Loading album details...</span>
          </div>

          <div
            v-else-if="isError && !isNotFound"
            class="rounded-lg border border-border bg-surface p-6 text-red-600"
            role="alert"
          >
            {{ (error as Error)?.message ?? "Something went wrong" }}
          </div>

          <div
            v-else-if="isNotFound"
            class="rounded-lg border border-border bg-surface p-10 text-center"
          >
            <h1 class="text-xl font-semibold text-primary">Product not found</h1>
            <p class="mt-2 text-neutral-500">
              This album may have been removed or the link is outdated.
            </p>
            <RouterLink
              to="/products"
              class="mt-6 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:opacity-90"
            >
              Back to products
            </RouterLink>
          </div>

          <template v-else-if="album">
            <div class="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              <div class="aspect-square overflow-hidden rounded bg-surface">
                <img
                  :src="coverSrc ?? 'https://placehold.co/800x800/f5f5f5/999?text=Vinyl'"
                  :alt="album.title"
                  class="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div class="flex flex-col">
                <p class="text-sm font-medium text-neutral-500">{{ album.artist }}</p>
                <h1 class="mt-1 text-2xl font-semibold tracking-tight text-primary md:text-3xl">
                  {{ album.title }}
                </h1>
                <p class="mt-4 text-2xl font-semibold">
                  ${{ Number(album.price).toFixed(2) }}
                  <span class="text-base font-normal text-neutral-500">USD</span>
                </p>
                <p v-if="album.stock !== undefined" class="mt-2 text-sm text-neutral-500">
                  {{ album.stock > 0 ? `${album.stock} in stock` : "Out of stock" }}
                </p>
                <p v-if="album.description" class="mt-6 text-sm leading-relaxed text-neutral-700">
                  {{ album.description }}
                </p>
                <div v-if="trackList.length" class="mt-8">
                  <h2 class="text-sm font-semibold uppercase tracking-wide text-primary">
                    Track list
                  </h2>
                  <ol class="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-neutral-700">
                    <li v-for="(track, i) in trackList" :key="`${track}-${i}`">
                      {{ track }}
                    </li>
                  </ol>
                </div>

                <div class="mt-8 space-y-2">
                  <div>
                    <label class="block text-sm font-semibold text-primary" for="product-qty-value">
                      Quantity
                    </label>
                    <div
                      class="mt-2 flex max-w-[11rem] border border-border bg-background"
                      role="group"
                      aria-label="Adjust quantity"
                    >
                      <button
                        type="button"
                        class="flex h-11 w-11 shrink-0 items-center justify-center text-lg font-semibold text-primary transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Decrease quantity"
                        :disabled="!inStock || quantity <= 1"
                        @click="decreaseQty"
                      >
                        −
                      </button>
                      <output
                        id="product-qty-value"
                        class="flex flex-1 items-center justify-center border-x border-border text-base font-semibold text-primary tabular-nums"
                        aria-live="polite"
                      >
                        {{ inStock ? quantity : 0 }}
                      </output>
                      <button
                        type="button"
                        class="flex h-11 w-11 shrink-0 items-center justify-center text-lg font-semibold text-primary transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                        :disabled="!inStock || quantity >= maxQty"
                        @click="increaseQty"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="w-full border border-primary bg-transparent py-3.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="!inStock"
                    @click="addToCart"
                  >
                    Add to cart
                  </button>

                  <button
                    type="button"
                    class="flex w-full items-center justify-center gap-1 bg-primary py-3.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="!inStock"
                    @click="buyWithShop"
                  >
                    Buy with
                    <span class="font-bold tracking-tight lowercase">shop</span>
                  </button>
                </div>
              </div>
            </div>

            <section v-if="relatedAlbums.length" class="pt-10">
              <h2 class="text-lg font-semibold text-primary">More from {{ album.artist }}</h2>
              <ProductGrid class="mt-6">
                <ProductCard
                  v-for="product in relatedAlbums"
                  :key="product.id"
                  :id="String(product.id)"
                  :slug="product.slug ?? slugify(product.title)"
                  :title="product.title"
                  :artist="product.artist"
                  :price="`$${Number(product.price).toFixed(2)}`"
                  :image="product.image_url ?? product.image"
                  :badges="product.badges ?? ['VINYL']"
                  :tracks="product.tracks?.length ?? 0"
                />
              </ProductGrid>
            </section>
          </template>
        </div>
      </template>
    </CatalogLayout>
    <HomeFooter />
  </main>
</template>
