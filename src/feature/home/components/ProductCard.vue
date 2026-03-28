<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { slugify } from "@/helpers/slug";

defineOptions({ name: "ProductCard" });

const props = defineProps<{
  id: string;
  /** URL segment; falls back to slugified title when omitted */
  slug?: string;
  title: string;
  artist: string;
  price: string;
  image?: string;
  badges?: string[];
  tracks?: number;
}>();

const hrefSlug = computed(() => props.slug ?? slugify(props.title));
</script>

<template>
  <RouterLink :to="`/product/${hrefSlug}`" class="group flex flex-col overflow-hidden group">
    <div class="relative aspect-square bg-surface">
      <img
        :src="image ? image : 'https://placehold.co/400x400/f5f5f5/999?text=Vinyl'"
        :alt="title"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute left-2 top-2 flex flex-wrap items-center gap-2">
        <span
          v-for="badge in badges"
          :key="badge"
          class="rounded px-2 py-0.5 text-xs font-medium"
          :class="
            badge === 'VINYL'
              ? 'bg-primary text-white'
              : 'bg-surface text-primary border border-border'
          "
        >
          {{ badge }}
        </span>

        <span v-if="tracks && tracks > 0" class="rounded px-2 py-0.5 text-xs font-medium">
          {{ tracks }} tracks
        </span>
      </div>
    </div>
    <div class="flex flex-1 flex-col p-4">
      <h4 class="text-sm font-medium text-neutral-500">
        {{ artist }}
      </h4>
      <h3
        class="line-clamp-2 text-sm md:text-base font-semibold text-primary group-hover:underline"
      >
        {{ title }}
      </h3>
      <p class="mt-2 text-sm md:text-base">{{ price }} USD</p>
    </div>
  </RouterLink>
</template>
