<script setup lang="ts">
import { ref } from 'vue'
import { UiModal, UiInput, UiButton } from '@/shared/components/ui'

defineOptions({ name: 'LoginModal' })

defineProps<{
  modelValue: boolean
}>()

const  emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()  

const email = ref('')
const password = ref('')

function close() {
    emit('update:modelValue', false)
}

function submit() {
  // TODO: auth logic
  close()
}
</script>

<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
      <h1 class="text-base md:text-lg lg:text-2xl font-logo font-semibold">
        Login to your account
      </h1>
      <p class="text-sm mb-8">
        Don't have an account? <a href="#" class="text-primary">Sign up</a>
      </p>
    <form id="login-form" class="space-y-4" @submit.prevent="submit">
      <UiInput v-model="email" type="email" placeholder="Email" />
      <UiInput v-model="password" type="password" placeholder="Password" />
    </form>

    <template #footer>
      <UiButton type="button" label="Cancel" variant="neutral" @click="close" />
      <UiButton type="submit" form="login-form" label="Log in" />
    </template>
  </UiModal>
</template>
