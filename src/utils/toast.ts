type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type: ToastType;
  message: string;
}

let toastCallback: ((options: ToastOptions) => void) | null = null;

export const toast = {
  success: (message: string) => {
    if (toastCallback) toastCallback({ type: 'success', message });
  },
  error: (message: string) => {
    if (toastCallback) toastCallback({ type: 'error', message });
  },
  info: (message: string) => {
    if (toastCallback) toastCallback({ type: 'info', message });
  },
  setCallback: (callback: (options: ToastOptions) => void) => {
    toastCallback = callback;
  }
};
