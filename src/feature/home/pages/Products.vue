<script setup lang="ts">
import { computed } from "vue";
import { HomeHeader, ProductCard, ProductGrid } from "../components";
import { CatalogLayout } from "../layouts";
import { getAllAlbums, type Product } from "../services/productApi";
import { useQuery } from "@tanstack/vue-query";

defineOptions({ name: "ProductsPage" });

const {
  data: albumsData,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["albums"],
  queryFn: getAllAlbums,
});

const albums = computed<Product[]>(() => {
  const raw = albumsData.value;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Product[];
  return ((raw as { data?: Product[] }).data ?? []) as Product[];
});
</script>

<template>
  <main class="min-h-screen bg-background">
    <HomeHeader />
    <CatalogLayout>
      <template #content>
        <div class="space-y-6">
          <div class="border-b border-border pb-4">
            <h1 class="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
              All products
            </h1>
            <p class="mt-1 text-sm text-neutral-500">
              Browse our vinyl and album catalog.
            </p>
          </div>

          <p v-if="isLoading" class="text-neutral-500">Loading albums...</p>
          <p v-else-if="isError" class="text-red-500">
            {{ error?.message ?? "Failed to load albums" }}
          </p>
          <div
            v-else-if="!albums.length"
            class="mt-5 flex flex-col items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <p class="text-base font-medium text-black">No albums yet</p>
          </div>
          <ProductGrid v-else>
            <ProductCard
              v-for="product in albums"
              :key="product.id"
              :id="String(product.id)"
              :slug="product.slug"
              :title="product.title"
              :artist="product.artist"
              :price="`$${Number(product.price).toFixed(2)}`"
              :image="product.image"
              :badges="product.badges ?? ['VINYL']"
              :tracks="product.tracks?.length ?? 0"
            />
          </ProductGrid>
        </div>
      </template>
    </CatalogLayout>
  </main>
</template>
