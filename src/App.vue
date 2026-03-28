<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ToastContainer } from '@/shared/components/ui'

const authStore = useAuthStore()

function handleAuthLogout() {
  authStore.logout(true)
}

onMounted(() => {
  authStore.hydrate()
  window.addEventListener('auth:logout', handleAuthLogout)
})

onUnmounted(() => {
  window.removeEventListener('auth:logout', handleAuthLogout)
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="layout" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <ToastContainer />
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
