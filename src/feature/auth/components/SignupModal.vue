<script setup lang="ts">
import { ref } from 'vue'
import { UiModal, UiInput, UiButton } from '@/shared/components/ui'

defineOptions({ name: 'SignupModal' })

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

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
    <template #title>Create account</template>

    <form id="signup-form" class="space-y-4" @submit.prevent="submit">
      <UiInput v-model="email" type="email" placeholder="Email" />
      <UiInput v-model="password" type="password" placeholder="Password" />
      <UiInput v-model="confirmPassword" type="password" placeholder="Confirm password" />
    </form>

    <template #footer>
      <UiButton type="button" label="Cancel" variant="neutral" @click="close" />
      <UiButton type="submit" form="signup-form" label="Sign up" />
    </template>
  </UiModal>
</template>
