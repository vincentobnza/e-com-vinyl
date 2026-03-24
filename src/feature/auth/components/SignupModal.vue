<script setup lang="ts">
import { ref } from 'vue'
import { UiModal, UiInput, UiButton } from '@/shared/components/ui'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'SignupModal' })

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open-login': []
}>()

const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

function close() {
  error.value = ''
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  emit('update:modelValue', false)
}

function openLogin() {
  close()
  emit('open-login')
}

async function submit() {
  error.value = ''
  if (!name.value.trim()) {
    error.value = 'Please enter your name.'
    return
  }
  if (!email.value) {
    error.value = 'Please enter your email.'
    return
  }
  if (!password.value) {
    error.value = 'Please enter a password.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await authStore.register(name.value.trim(), email.value, password.value, confirmPassword.value)
    close()
  } catch (err: unknown) {
    const res = err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response?.data
      : null
    const msg = res?.errors?.email?.[0]
      ?? res?.errors?.password?.[0]
      ?? res?.errors?.name?.[0]
      ?? res?.message
      ?? 'Something went wrong. Please try again.'
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <h1 class="text-base md:text-lg lg:text-2xl font-logo font-semibold">
      Create account
    </h1>
    <p class="text-sm mb-6">
      Already have an account? <a href="#" class="text-primary" @click.prevent="openLogin">Log in</a>
    </p>
    <form id="signup-form" class="space-y-4" @submit.prevent="submit">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <UiInput
        v-model="name"
        type="text"
        placeholder="Name"
        :disabled="loading"
        :error="!!error"
      />
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
      <UiInput
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm password"
        :disabled="loading"
        :error="!!error"
      />
    </form>

    <template #footer>
      <UiButton type="button" label="Cancel" variant="neutral" :disabled="loading" @click="close" />
      <UiButton type="submit" form="signup-form" label="Sign up" :loading="loading" />
    </template>
  </UiModal>
</template>
