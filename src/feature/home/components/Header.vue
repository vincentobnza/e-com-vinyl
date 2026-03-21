<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import { LoginModal    } from '@/feature/auth/components'

defineOptions({ name: 'HomeHeader' })

const NAV_ICONS = [
  { name: 'io-search-outline', action: null as string | null },
  { name: 'bi-cart-dash', action: null as string | null },
  { name: 'ri-user-6-line', action: 'user' as string | null },
] as const

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const showLogin = ref(false)


function closeUserMenu() {
  userMenuOpen.value = false
  document.removeEventListener('click', handleClickOutside)
}

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    closeUserMenu()
  }
}

function openLoginModal() {
  showLogin.value = true
}


onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-10 bg-surface backdrop-blur-xl w-full p-4">
    <div class="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
      <div class="flex items-center">
        <h1
          class="text-base sm:text-lg md:text-xl lg:text-2xl logo-font font-semibold tracking-wider"
        >
          CD's Hub
        </h1>
      </div>

      <div class="flex items-center gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        <OhVueIcon :name="NAV_ICONS[0].name" class="shrink-0" scale="1.3" />
        <OhVueIcon :name="NAV_ICONS[1].name" class="shrink-0" scale="1.3" />
        <div ref="userMenuRef" class="relative">
          <button
            type="button"
            class="flex shrink-0 rounded-full p-1 transition-colors hover:bg-black/5"
            aria-haspopup="menu"
            :aria-expanded="showLogin"
            @click="openLoginModal"
          >
            <OhVueIcon :name="NAV_ICONS[2].name" class="shrink-0" scale="1.3" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <LoginModal v-model="showLogin" />
</template>
