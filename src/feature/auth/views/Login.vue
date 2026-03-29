<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UiInput, UiButton } from "@/shared/components/ui";
import { useAuthStore } from "@/stores/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import AuthPageShell from "../components/AuthPageShell.vue";

defineOptions({ name: "LoginView" });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const inputDark =
  "!border-white/25 !bg-transparent !text-white placeholder:text-white/40 focus:!border-white/55 focus:!ring-white";

function fieldClass(hasError: boolean) {
  return [inputDark, hasError && "!border-red-400/90 focus:!border-red-400 focus:!ring-red-400/25"]
    .filter(Boolean)
    .join(" ");
}

const redirectTo = computed(() => {
  const r = route.query.redirect;
  return typeof r === "string" && r.startsWith("/") ? r : "/";
});

async function submit() {
  error.value = "";
  if (!email.value.trim()) {
    error.value = "Please enter your email.";
    return;
  }
  if (!password.value) {
    error.value = "Please enter your password.";
    return;
  }
  loading.value = true;
  try {
    await authStore.login(email.value.trim(), password.value);
    await router.replace(redirectTo.value);
  } catch (err: unknown) {
    error.value = getApiErrorMessage(err, "Invalid email or password.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <AuthPageShell tagline="Welcome back—sign in to pick up where you left off, cart and all.">
    <div class="w-full text-center sm:text-left">
      <header class="mb-8">
        <h1 class="text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">Sign in</h1>
        <p class="mt-2 text-sm text-white/55">Use the email and password for your account.</p>
      </header>

      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <p
          v-if="error"
          class="rounded-lg border border-red-400/35 bg-red-500/15 px-3 py-2 text-left text-sm text-red-100"
          role="alert"
        >
          {{ error }}
        </p>

        <div class="flex flex-col gap-1.5 text-left">
          <label for="login-email" class="text-sm font-medium text-white/85"> Email </label>
          <UiInput
            id="login-email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            size="large"
            :class="fieldClass(!!error)"
            :disabled="loading"
            :error="!!error"
          />
        </div>

        <div class="flex flex-col gap-1.5 text-left">
          <label for="login-password" class="text-sm font-medium text-white/85"> Password </label>
          <UiInput
            id="login-password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            size="large"
            :class="fieldClass(!!error)"
            :disabled="loading"
            :error="!!error"
          />
        </div>

        <UiButton
          type="submit"
          label="Sign in"
          variant="secondary"
          size="large"
          class="mt-1 w-full py-3!"
          :loading="loading"
        />
      </form>

      <p class="mt-8 text-sm text-white/55">
        New here?
        <RouterLink
          :to="{ path: '/register', query: route.query }"
          class="font-medium text-white underline decoration-white/40 underline-offset-2 hover:text-red-500 hover:decoration-red-500"
        >
          Create an account
        </RouterLink>
      </p>

      <p class="mt-6">
        <RouterLink
          to="/"
          class="text-xs font-medium text-white/40 transition-colors hover:text-red-500 hover:decoration-red-500"
        >
          ← Back to store
        </RouterLink>
      </p>
    </div>
  </AuthPageShell>
</template>
