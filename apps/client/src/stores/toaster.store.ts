import { Time } from '@packages/shared';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

import type { ToastVariant } from '#src/components/base/toast.base.vue';

export interface Toast {
  id: string;
  message: string;
  timestamp: number;
  variant: ToastVariant;
  duration: number;
}
export type ToasterState = Toast[];

export const useToasterStore = defineStore(
  'toaster',
  () => {
    const toasts = reactive<ToasterState>([]);

    const createToast = (
      toast: Omit<Toast, 'duration' | 'id' | 'timestamp'>,
    ) => {
      const lastToast = toasts.at(-1);
      const timestamp = Date.now();

      /**
       * Allow deduplication when websocket connections are lost on pages with
       * multiple topic subscriptions: each connection is notifying the user
       * about lost connection and retry mechanism.
       */
      if (
        lastToast &&
        lastToast.message === toast.message &&
        timestamp - lastToast.timestamp < 200 * Time.Millisecond
      ) {
        return;
      }

      const id = `toast-${timestamp}`;
      const wordCount = toast.message.split(' ').length;
      const duration =
        3 * Time.Second + Math.round((wordCount / 150) * Time.Minute);

      toasts.push({ ...toast, duration, id, timestamp });
    };

    const deleteToast = (toast: Toast) => {
      const index = toasts.findIndex((t) => {
        return t.id === toast.id;
      });

      if (index !== -1) {
        toasts.splice(index, 1);
      }
    };

    const newToast = {
      error: (message: string) => {
        return createToast({ message, variant: 'error' });
      },
      info: (message: string) => {
        return createToast({ message, variant: 'info' });
      },
      success: (message: string) => {
        return createToast({ message, variant: 'success' });
      },
      warning: (message: string) => {
        return createToast({ message, variant: 'warning' });
      },
    };

    return { toasts, newToast, deleteToast };
  },
  { persist: true },
);
