<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'UiModal', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    closeOnOverlay?: boolean
    showClose?: boolean
  }>(),
  { modelValue: false, closeOnOverlay: true, showClose: true }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick() {
  if (props.closeOnOverlay) close()
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-black/50"
          aria-hidden="true"
          @click="onOverlayClick"
        />

        <div
          class="relative z-10 w-full max-w-md rounded bg-background shadow-xl"
          @click.stop
        >
          <div v-if="showClose" class="absolute right-4 top-4">
            <button
              type="button"
              class="rounded p-1 text-neutral-500 hover:bg-surface hover:text-primary transition-colors"
              aria-label="Close"
              @click="close"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <slot name="header">
              <h2 v-if="$slots.title" class="text-lg font-semibold">
                <slot name="title" />
              </h2>
            </slot>

            <div class="mt-4">
              <slot />
            </div>

            <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
