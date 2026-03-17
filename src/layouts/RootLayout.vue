<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <header class="border-b border-neutral-800">
    
    </header>

    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
