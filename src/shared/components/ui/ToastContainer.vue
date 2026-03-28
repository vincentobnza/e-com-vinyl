<script setup lang="ts">
import { useToastStore, type ToastRecord, type ToastType } from "@/stores/toast";

defineOptions({ name: "ToastContainer" });

const store = useToastStore();

function iconWrapClass(type: ToastType) {
  const map: Record<ToastType, string> = {
    default: "bg-neutral-100 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-sky-100 text-sky-800",
    loading: "bg-neutral-100 text-primary",
  };
  return map[type];
}

function onAction(t: ToastRecord) {
  t.action?.onClick();
  store.dismiss(t.id);
}

function onDismiss(id: string) {
  store.dismiss(id);
}
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-4 sm:right-4 sm:max-w-[420px] sm:p-4"
      aria-live="polite"
      aria-relevant="additions text"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <article
          v-for="t in store.items"
          :key="t.id"
          class="pointer-events-auto relative overflow-hidden rounded-xl border border-border/80 bg-white text-primary shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] ring-1 ring-black/5"
          role="status"
        >
          <div class="flex gap-3 p-4 pr-10">
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border"
              :class="iconWrapClass(t.type)"
              aria-hidden="true"
            >
              <!-- success -->
              <svg
                v-if="t.type === 'success'"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- error -->
              <svg
                v-else-if="t.type === 'error'"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
              <!-- warning -->
              <svg
                v-else-if="t.type === 'warning'"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2L1 21h22L12 2zm0 16a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-1-11v7h2V7h-2z"
                />
              </svg>
              <!-- info -->
              <svg
                v-else-if="t.type === 'info'"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" stroke-linecap="round" />
              </svg>
              <!-- loading -->
              <svg
                v-else-if="t.type === 'loading'"
                class="toast-spinner h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  class="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="3"
                />
                <path
                  class="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <!-- default -->
              <svg
                v-else
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>

            <div class="min-w-0 flex-1 pt-0.5">
              <p class="text-[0.9375rem] font-semibold leading-snug tracking-tight text-primary">
                {{ t.title }}
              </p>
              <p v-if="t.description" class="mt-1 text-sm leading-relaxed text-neutral-600">
                {{ t.description }}
              </p>
              <button
                v-if="t.action"
                type="button"
                class="mt-3 text-sm font-semibold text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
                @click="onAction(t)"
              >
                {{ t.action.label }}
              </button>
            </div>
          </div>

          <button
            type="button"
            class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-black/5 hover:text-primary"
            aria-label="Dismiss notification"
            @click="onDismiss(t.id)"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>

          <div
            v-if="t.duration > 0 && t.type !== 'loading'"
            class="toast-progress h-0.5 w-full origin-left bg-primary/25"
            :style="{ animationDuration: `${t.duration}ms` }"
          />
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-spinner {
  animation: toast-spin 0.7s linear infinite;
}

@keyframes toast-spin {
  to {
    transform: rotate(360deg);
  }
}

.toast-progress {
  animation: toast-progress linear forwards;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-enter-active {
  transition: all 0.38s cubic-bezier(0.21, 1, 0.36, 1);
}

.toast-leave-active {
  transition: all 0.28s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(calc(100% + 12px)) scale(0.96);
}

.toast-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.toast-move {
  transition: transform 0.35s cubic-bezier(0.21, 1, 0.36, 1);
}
</style>
