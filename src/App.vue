<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="layout" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.15s ease;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
