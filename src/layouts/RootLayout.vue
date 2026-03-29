<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-background">
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </div>
</template>
