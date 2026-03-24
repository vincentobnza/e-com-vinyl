<template>
  <button type="button" :disabled="disabled || loading" :class="buttonClasses" v-bind="$attrs">
    <span v-if="loading" class="button-spinner" aria-hidden="true" />
    <template v-else>
      <span v-if="iconPosition === 'left' && $slots.icon" class="button-icon">
        <slot name="icon" />
      </span>
      <span class="button-label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="iconPosition === 'right' && $slots.icon" class="button-icon">
        <slot name="icon" />
      </span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    variant?: "primary" | "secondary" | "accent" | "neutral";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    loading?: boolean;
    iconPosition?: "left" | "right";
  }>(),
  {
    label: "",
    variant: "primary",
    size: "medium",
    disabled: false,
    loading: false,
    iconPosition: "left",
  },
);

defineOptions({
  name: "UiButton",
  inheritAttrs: false,
});

const variantClasses: Record<string, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus:ring-primary-muted disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary-muted disabled:opacity-50 disabled:cursor-not-allowed",
  accent:
    "bg-accent text-black hover:opacity-90 focus:ring-accent-muted disabled:opacity-50 disabled:cursor-not-allowed",
  neutral:
    "bg-surface text-white border border-border hover:bg-surface-hover focus:ring-border-hover disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses: Record<string, string> = {
  small: "px-3 py-1.5 text-sm gap-1.5",
  medium: "px-4 py-2.5 text-sm gap-1",
  large: "px-6 py-3 text-base gap-3",
};

const buttonClasses = computed(() => {
  const base =
    "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background cursor-pointer";
  return [base, variantClasses[props.variant], sizeClasses[props.size]].join(" ");
});
</script>

<style scoped>
.button-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.button-icon {
  display: inline-flex;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
