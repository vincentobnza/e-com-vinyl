import { defineStore } from "pinia";
import { shallowRef } from "vue";

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastInput {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastRecord extends Required<Pick<ToastInput, "title">> {
  id: string;
  type: ToastType;
  description?: string;
  duration: number;
  action?: ToastAction;
  createdAt: number;
}

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 8;

function genId() {
  return `toast_${crypto.randomUUID()}`;
}

export const useToastStore = defineStore("toast", () => {
  const items = shallowRef<ToastRecord[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function scheduleDismiss(id: string, duration: number) {
    if (duration <= 0) return;
    const existing = timers.get(id);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => {
      timers.delete(id);
      dismiss(id);
    }, duration);
    timers.set(id, t);
  }

  function add(input: ToastInput): string {
    const id = genId();
    const duration = input.duration ?? (input.type === "loading" ? 0 : DEFAULT_DURATION);
    const record: ToastRecord = {
      id,
      type: input.type ?? "default",
      title: input.title,
      description: input.description,
      duration,
      action: input.action,
      createdAt: Date.now(),
    };

    let next = [...items.value, record];
    if (next.length > MAX_TOASTS) {
      const removed = next.slice(0, next.length - MAX_TOASTS);
      removed.forEach((r) => {
        const tm = timers.get(r.id);
        if (tm) clearTimeout(tm);
        timers.delete(r.id);
      });
      next = next.slice(-MAX_TOASTS);
    }
    items.value = next;
    scheduleDismiss(id, duration);
    return id;
  }

  function update(id: string, patch: Partial<ToastInput> & { type?: ToastType }) {
    const idx = items.value.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const prev = items.value[idx];
    if (!prev) return;

    const nextType = patch.type ?? prev.type;
    const nextDuration =
      patch.duration !== undefined
        ? patch.duration
        : nextType === "loading"
          ? 0
          : prev.duration;

    const next: ToastRecord = {
      id: prev.id,
      createdAt: prev.createdAt,
      type: nextType,
      title: patch.title ?? prev.title,
      description: patch.description !== undefined ? patch.description : prev.description,
      duration: nextDuration,
      action: patch.action !== undefined ? patch.action : prev.action,
    };

    const tm = timers.get(id);
    if (tm) clearTimeout(tm);
    timers.delete(id);
    scheduleDismiss(id, nextDuration);

    const copy = [...items.value];
    copy[idx] = next;
    items.value = copy;
  }

  function dismiss(id: string) {
    const tm = timers.get(id);
    if (tm) clearTimeout(tm);
    timers.delete(id);
    items.value = items.value.filter((t) => t.id !== id);
  }

  function dismissAll() {
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
    items.value = [];
  }

  return {
    items,
    add,
    update,
    dismiss,
    dismissAll,
  };
});
