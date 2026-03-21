<template>
  <div class="relative flex items-center w-full">
    <span
      v-if="$slots.prefix"
      class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted pointer-events-none"
      aria-hidden="true"
    >
      <slot name="prefix" />
    </span>
    <input
      ref="inputRef"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      v-bind="$attrs"
      @input="emitUpdate"
    />
    <span
      v-if="$slots.suffix"
      class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted pointer-events-none"
      aria-hidden="true"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

const slots = useSlots()
const props = withDefaults(
  defineProps<{
    modelValue?: string
    type?: 'text' | 'search' | 'password' | 'email'
    placeholder?: string
    disabled?: boolean
    size?: 'small' | 'medium' | 'large'
    error?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    size: 'medium',
    error: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
})

const inputRef = ref<HTMLInputElement | null>(null)

function emitUpdate(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const sizeClasses: Record<string, string> = {
  small: 'h-8 px-3 text-sm',
  medium: 'h-10 px-4 text-sm',
  large: 'h-12 px-4 text-base',
}

const inputClasses = computed(() => {
  const base =
    'w-full bg-background border border-border text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary'
  const paddingLeft = slots.prefix ? 'pl-10' : ''
  const paddingRight = slots.suffix ? 'pr-10' : ''
  const error = props.error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''
  return [base, sizeClasses[props.size], paddingLeft, paddingRight, error].filter(Boolean).join(' ')
})
</script>
