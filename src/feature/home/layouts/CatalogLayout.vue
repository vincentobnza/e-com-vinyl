<script setup lang="ts">
defineOptions({ name: "CatalogLayout" });
</script>

<template>
  <div class="flex w-full max-w-screen-2xl mx-auto py-6 gap-4">
    <div class="flex-1 min-w-0">
      <slot name="content" />
    </div>
  </div>
</template>
