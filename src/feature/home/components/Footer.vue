<script setup lang="ts">
defineOptions({ name: "HomeFooter" });

const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-auto w-full border-t border-border bg-surface/90 backdrop-blur-xl">
    <div
      class="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between"
    >
      <div>
        <RouterLink
          to="/"
          class="logo-font text-lg font-semibold tracking-wider text-primary sm:text-xl"
        >
          CD's Hub
        </RouterLink>
        <p class="mt-2 max-w-sm text-sm text-neutral-500">
          Vinyl and albums curated for your collection.
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="Footer">
        <RouterLink to="/products" class="font-medium text-primary hover:opacity-80">
          Products
        </RouterLink>
        <RouterLink to="/search" class="font-medium text-primary hover:opacity-80">
          Search
        </RouterLink>
        <RouterLink to="/cart" class="font-medium text-primary hover:opacity-80"> Cart </RouterLink>
      </nav>
    </div>
    <div class="bg-primary">
      <div
        class="mx-auto max-w-screen-2xl px-4 py-4 text-center text-xs text-neutral-200 sm:text-left"
      >
        © {{ year }} CD's Hub. All rights reserved.
      </div>
    </div>
  </footer>
</template>
