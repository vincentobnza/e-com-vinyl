<template>
  <span
    :class="classes"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg";
  }>(),
  {
    size: "md",
  },
);

defineOptions({ name: "UiSpinner" });

const sizeClasses: Record<string, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const classes = computed(() =>
  [
    "inline-block shrink-0 rounded-full border-solid border-current border-r-transparent animate-spin",
    sizeClasses[props.size],
  ].join(" "),
);
</script>
