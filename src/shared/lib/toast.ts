import { useToastStore } from "@/stores/toast";
import type { ToastAction, ToastInput, ToastType } from "@/stores/toast";

export type { ToastAction, ToastType };

export interface ToastOptions {
  description?: string;
  /** ms; `0` = no auto-dismiss */
  duration?: number;
  action?: ToastAction;
}

function push(type: ToastType, title: string, options?: ToastOptions) {
  return useToastStore().add({
    type,
    title,
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
  });
}

export const toast = Object.assign(
  (title: string, options?: ToastOptions) => push("default", title, options),
  {
    default: (title: string, options?: ToastOptions) => push("default", title, options),
    success: (title: string, options?: ToastOptions) => push("success", title, options),
    error: (title: string, options?: ToastOptions) => push("error", title, options),
    warning: (title: string, options?: ToastOptions) => push("warning", title, options),
    info: (title: string, options?: ToastOptions) => push("info", title, options),
    loading: (title: string, options?: Omit<ToastOptions, "duration">) =>
      useToastStore().add({
        type: "loading",
        title,
        description: options?.description,
        duration: 0,
        action: options?.action,
      }),

    dismiss: (id: string) => useToastStore().dismiss(id),
    dismissAll: () => useToastStore().dismissAll(),

    /**
     * Shows a loading toast, then replaces it with success or error.
     */
    async promise<T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
      },
      options?: { successDescription?: string; errorDescription?: string },
    ): Promise<T> {
      const store = useToastStore();
      const id = store.add({
        type: "loading",
        title: messages.loading,
        duration: 0,
      });
      try {
        const data = await promise;
        const title =
          typeof messages.success === "function" ? messages.success(data) : messages.success;
        store.update(id, {
          type: "success",
          title,
          description: options?.successDescription,
          duration: 4000,
        });
        return data;
      } catch (err) {
        const title =
          typeof messages.error === "function" ? messages.error(err) : messages.error;
        store.update(id, {
          type: "error",
          title,
          description: options?.errorDescription,
          duration: 6000,
        });
        throw err;
      }
    },

    /** Imperative add with full control */
    custom: (input: ToastInput) => useToastStore().add(input),
  },
);
