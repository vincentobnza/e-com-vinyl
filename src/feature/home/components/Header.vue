<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { OhVueIcon } from "oh-vue-icons";
import { LoginModal, SignupModal } from "@/feature/auth/components";
import { useAuthStore } from "@/stores/auth";

defineOptions({ name: "HomeHeader" });

const authStore = useAuthStore();
const NAV_ICONS = [
  { name: "io-search-outline", action: null as string | null },
  { name: "bi-cart-dash", action: null as string | null },
  { name: "ri-user-6-line", action: "user" as string | null },
] as const;

const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const showLogin = ref(false);
const showSignup = ref(false);

function closeUserMenu() {
  userMenuOpen.value = false;
  document.removeEventListener("click", handleClickOutside);
}

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    closeUserMenu();
  }
}

function openAuthModal() {
  showSignup.value = true;
}

function switchToLogin() {
  showSignup.value = false;
  showLogin.value = true;
}

function switchToSignup() {
  showLogin.value = false;
  showSignup.value = true;
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
            v-if="!authStore.isAuthenticated"
            type="button"
            class="flex shrink-0 rounded-full p-1 transition-colors hover:bg-black/5 cursor-pointer"
            aria-haspopup="menu"
            :aria-expanded="showSignup || showLogin"
            @click="openAuthModal"
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

  <LoginModal v-model="showLogin" @open-signup="switchToSignup" />
  <SignupModal v-model="showSignup" @open-login="switchToLogin" />
</template>
