// src/common/hooks/useToast.ts

import { useCallback } from 'react';
import notify from 'devextreme/ui/notify';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    notify(message, type, duration);
  }, []);

  return { showToast };
}