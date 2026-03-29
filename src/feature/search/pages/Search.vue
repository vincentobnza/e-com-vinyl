<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import { OhVueIcon } from "oh-vue-icons";
import { HomeHeader, HomeFooter, ProductCard, ProductGrid } from "@/feature/home/components";
import { CatalogLayout } from "@/feature/home/layouts";
import { UiInput } from "@/shared/components/ui";
import { useDebounce } from "@/shared/hooks";
import { slugify } from "@/helpers/slug";
import { searchAlbums } from "../services/searchAlbums";
import type { Album } from "@/api/albums";

defineOptions({ name: "SearchPage" });

const MIN_QUERY_LEN = 2;
const DEBOUNCE_MS = 350;

const route = useRoute();
const router = useRouter();

function queryParamQ(): string {
  const q = route.query.q;
  if (typeof q === "string") return q;
  if (Array.isArray(q) && q[0] != null) return String(q[0]);
  return "";
}

const inputValue = ref(queryParamQ());
const debouncedInput = useDebounce(inputValue, DEBOUNCE_MS);

const searchTerm = computed(() => debouncedInput.value.trim());
const canSearch = computed(() => searchTerm.value.length >= MIN_QUERY_LEN);

const page = ref(1);

watch(
  () => route.query.q,
  () => {
    const next = queryParamQ();
    if (next !== inputValue.value) {
      inputValue.value = next;
    }
  },
);

watch(searchTerm, (term, prev) => {
  if (prev !== undefined && term !== prev) {
    page.value = 1;
  }
});

watch(debouncedInput, () => {
  const trimmed = debouncedInput.value.trim();
  const nextQ = trimmed || undefined;
  const cur = queryParamQ().trim();
  if ((nextQ ?? "") === cur) return;
  router.replace({
    path: "/search",
    query: nextQ ? { q: nextQ } : {},
  });
});

const {
  data: pageData,
  isLoading,
  isFetching,
  isError,
  error,
  isPlaceholderData,
} = useQuery({
  queryKey: ["albums", "search", searchTerm, page],
  queryFn: () => searchAlbums(searchTerm.value, page.value),
  enabled: canSearch,
  placeholderData: keepPreviousData,
});

const results = computed<Album[]>(() => pageData.value?.data ?? []);
const total = computed(() => pageData.value?.total ?? 0);
const lastPage = computed(() => pageData.value?.last_page ?? 1);
const currentPage = computed(() => pageData.value?.current_page ?? 1);

function goPrev() {
  if (page.value > 1) page.value -= 1;
}

function goNext() {
  if (page.value < lastPage.value) page.value += 1;
}
</script>

<template>
  <main class="flex min-h-screen flex-col bg-background">
    <HomeHeader />
    <CatalogLayout>
      <template #content>
        <div class="space-y-8">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight text-primary md:text-3xl">Search</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Find albums by title, artist, or description. Multi-word queries match every word.
            </p>
          </div>

          <div class="relative max-w-2xl">
            <UiInput
              v-model="inputValue"
              type="search"
              placeholder="Try Pink Floyd, Lany, vinyl…"
              size="large"
              class="w-full"
              autocomplete="off"
              aria-label="Search catalog"
              @keydown.enter.prevent
            >
              <template #prefix>
                <OhVueIcon name="io-search-outline" scale="1.1" class="text-neutral-400" />
              </template>
            </UiInput>
            <p v-if="inputValue.trim() && !canSearch" class="mt-2 text-xs text-neutral-500">
              Type at least {{ MIN_QUERY_LEN }} characters to search.
            </p>
          </div>

          <div v-if="canSearch" class="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span v-if="isFetching && !isPlaceholderData">Searching…</span>
            <span v-else-if="!isLoading && pageData">
              {{ total }} result{{ total === 1 ? "" : "s" }}
              <span v-if="isFetching" class="text-neutral-400"> (updating)</span>
            </span>
          </div>

          <p v-if="isError" class="text-sm text-red-600" role="alert">
            {{ (error as Error)?.message ?? "Search failed" }}
          </p>

          <div
            v-else-if="canSearch && !isLoading && !results.length"
            class="px-6 py-12 text-center text-neutral-600"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/482/482069.png"
              alt="Search"
              class="size-16 mx-auto mb-8"
            />
            <p class="font-medium text-primary">No matches</p>
            <p class="mt-2 text-sm">
              Try different keywords or fewer words. All words must appear somewhere on the album.
            </p>
          </div>

          <template v-else-if="canSearch && results.length">
            <ProductGrid>
              <ProductCard
                v-for="album in results"
                :key="album.id"
                :id="String(album.id)"
                :slug="album.slug ?? slugify(album.title)"
                :title="album.title"
                :artist="album.artist"
                :price="`$${Number(album.price).toFixed(2)}`"
                :image="album.image_url ?? album.image ?? undefined"
                :badges="['VINYL']"
                :tracks="album.tracks?.length ?? 0"
              />
            </ProductGrid>

            <nav
              v-if="lastPage > 1"
              class="flex items-center justify-center gap-4 pt-6"
              aria-label="Pagination"
            >
              <button
                type="button"
                class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage <= 1 || isFetching"
                @click="goPrev"
              >
                Previous
              </button>
              <span class="text-sm text-neutral-500 tabular-nums">
                Page {{ currentPage }} / {{ lastPage }}
              </span>
              <button
                type="button"
                class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage >= lastPage || isFetching"
                @click="goNext"
              >
                Next
              </button>
            </nav>
          </template>

          <div
            v-else-if="!canSearch && !inputValue.trim()"
            class="px-6 py-10 text-center text-sm sm:text-base md:text-lg text-neutral-500"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/482/482069.png"
              alt="Search"
              class="size-16 mx-auto mb-8"
            />
            Enter a search above. Use several words to narrow results (e.g.
            <span class="font-medium text-primary">swift vinyl</span>).
          </div>
        </div>
      </template>
    </CatalogLayout>
    <HomeFooter />
  </main>
</template>
