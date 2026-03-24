<script setup lang="ts">
import { ref } from 'vue'
import { UiModal, UiInput, UiButton } from '@/shared/components/ui'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'LoginModal' })

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open-signup': []
}>()

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function close() {
  error.value = ''
  email.value = ''
  password.value = ''
  emit('update:modelValue', false)
}

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    close()
  } catch (err: unknown) {
    const msg = err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response?.data?.message
        ?? (err as { response?: { data?: { errors?: Record<string, string[]> } } }).response?.data?.errors?.email?.[0]
        ?? 'Invalid email or password.'
      : 'Something went wrong. Please try again.'
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <h1 class="text-base md:text-lg lg:text-2xl font-logo font-semibold">
      Login to your account
    </h1>
    <p class="text-sm mb-6">
      Don't have an account? <a href="#" class="text-primary" @click.prevent="$emit('open-signup')">Sign up</a>
    </p>
    <form id="login-form" class="space-y-4" @submit.prevent="submit">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <UiInput
        v-model="email"
        type="email"
        placeholder="Email"
        :disabled="loading"
        :error="!!error"
      />
      <UiInput
        v-model="password"
        type="password"
        placeholder="Password"
        :disabled="loading"
        :error="!!error"
      />
    </form>

    <template #footer>
      <UiButton type="button" label="Cancel" variant="neutral" :disabled="loading" @click="close" />
      <UiButton type="submit" form="login-form" label="Log in" :loading="loading" />
    </template>
  </UiModal>
</template>
