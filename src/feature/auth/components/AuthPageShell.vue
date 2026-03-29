<script setup lang="ts">
defineOptions({ name: "AuthPageShell" });

withDefaults(
  defineProps<{
    tagline?: string;
    eyebrow?: string;
  }>(),
  {
    tagline: "Explore curated vinyl and albums for your collection.",
    eyebrow: "CD's Hub",
  },
);
</script>

<template>
  <div
    class="relative flex h-dvh min-h-dvh w-full max-w-full flex-col overflow-hidden bg-primary text-white"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        class="absolute -right-1/4 -top-1/4 h-[min(85vh,560px)] w-[min(85vw,560px)] rounded-full bg-secondary opacity-[0.38] blur-[100px]"
      />
      <div
        class="absolute -bottom-1/4 -left-1/4 h-[min(70vh,480px)] w-[min(70vw,480px)] rounded-full bg-accent opacity-[0.28] blur-[90px]"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(165deg,transparent_0%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.65)_100%)]"
      />
    </div>

    <header class="relative z-10 shrink-0 px-5 pt-6 sm:px-10 sm:pt-8">
      <RouterLink
        to="/"
        class="logo-font inline-block text-lg font-semibold tracking-[0.2em] text-white transition-opacity hover:opacity-85 sm:text-xl"
      >
        CD's Hub
      </RouterLink>
      <p
        class="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-white/45 sm:text-xs"
      >
        {{ eyebrow }}
      </p>
      <p class="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-[0.9375rem]">
        {{ tagline }}
      </p>
    </header>

    <div
      class="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain px-4 py-10 sm:px-8 sm:py-12"
    >
      <div class="w-full max-w-[420px]">
        <slot />
      </div>
    </div>

    <footer class="relative z-10 shrink-0 px-5 pb-6 text-center sm:px-10">
      <p class="text-xs leading-relaxed text-white/30">
        Authentic pressings. Careful curation. Your next favorite record is here.
      </p>
    </footer>
  </div>
</template>
