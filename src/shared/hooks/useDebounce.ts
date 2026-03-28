import {
  onScopeDispose,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

/**
 * Returns a ref that updates to match `source` only after `delayMs` of stability.
 */
export function useDebounce<T>(source: MaybeRefOrGetter<T>, delayMs = 300): Ref<T> {
  const debounced = ref(toValue(source)) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(
    () => toValue(source),
    (value) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        debounced.value = value;
        timer = null;
      }, delayMs);
    },
    { flush: "post" },
  );

  onScopeDispose(() => {
    if (timer) clearTimeout(timer);
  });

  return debounced;
}
