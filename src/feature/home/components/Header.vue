<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { OhVueIcon } from "oh-vue-icons";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";

defineOptions({ name: "HomeHeader" });

const authStore = useAuthStore();
const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);
const router = useRouter();
const NAV_ICONS = [
  { name: "io-search-outline", action: null as string | null },
  { name: "bi-cart-dash", action: null as string | null },
  { name: "ri-user-6-line", action: "user" as string | null },
] as const;

const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

function closeUserMenu() {
  userMenuOpen.value = false;
  document.removeEventListener("click", handleClickOutside);
}

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    closeUserMenu();
  }
}

async function handleLogout() {
  await authStore.logout();
  closeUserMenu();
}

watch(userMenuOpen, (open) => {
  if (open) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header class="sticky top-0 z-10 bg-surface backdrop-blur-xl w-full p-4">
    <div class="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
      <div class="flex items-center">
        <RouterLink
          to="/"
          class="text-base sm:text-lg md:text-xl lg:text-2xl logo-font font-semibold tracking-wider"
        >
          CD's Hub
        </RouterLink>
      </div>

      <div class="flex items-center gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        <RouterLink
          to="/search"
          class="flex shrink-0 rounded-full p-1 text-inherit transition-colors hover:bg-black/5"
          aria-label="Search"
        >
          <OhVueIcon :name="NAV_ICONS[0].name" class="shrink-0" scale="1.3" />
        </RouterLink>
        <RouterLink
          to="/cart"
          class="relative flex shrink-0 rounded-full p-1 text-inherit transition-colors hover:bg-black/5"
          :aria-label="
            itemCount > 0 ? `Shopping cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Cart'
          "
        >
          <OhVueIcon :name="NAV_ICONS[1].name" class="shrink-0" scale="1.3" />
          <span
            v-if="itemCount > 0"
            class="absolute -right-0.5 -top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white tabular-nums ring-2 ring-surface"
          >
            {{ itemCount > 99 ? "99+" : itemCount }}
          </span>
        </RouterLink>
        <div ref="userMenuRef" class="relative">
          <button
            v-if="!authStore.isAuthenticated"
            type="button"
            class="flex shrink-0 rounded-full p-1 transition-colors hover:bg-black/5 cursor-pointer"
            aria-haspopup="menu"
            @click="router.push('/login')"
          >
            <OhVueIcon :name="NAV_ICONS[2].name" class="shrink-0" scale="1.3" />
          </button>
          <div v-else class="relative" @click="userMenuOpen = !userMenuOpen">
            <button
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-black/5 cursor-pointer"
              aria-haspopup="menu"
              :aria-expanded="userMenuOpen"
            >
              <span class="max-w-120 truncate text-sm font-medium">{{ authStore.user?.name }}</span>
              <OhVueIcon :name="NAV_ICONS[2].name" class="shrink-0" scale="1.3" />
            </button>
            <div
              v-show="userMenuOpen"
              class="absolute right-0 top-full mt-1 max-w-160 rounded-lg border border-border bg-surface py-1 shadow-lg cursor-pointer"
            >
              <button
                type="button"
                class="w-full px-4 py-2 text-left text-sm hover:bg-black/5"
                @click="handleLogout"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
