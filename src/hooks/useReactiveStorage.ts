// hooks/useReactiveStorage.ts
import { useState, useEffect } from 'react';
import { storageService } from '@/common/utility/storageService';

export function useReactiveStorage(key: string) {
    const [value, setValue] = useState<string | null>(() =>
        storageService.getItem(key)
    );

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                setValue(e.newValue);
            }
        };

        const handleCustomEvent = (e: CustomEvent) => {
            if (e.detail?.key === key) {
                setValue(e.detail?.value);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('storageChange', handleCustomEvent as EventListener);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('storageChange', handleCustomEvent as EventListener);
        };
    }, [key]);

    const updateValue = (newValue: string | null) => {
        storageService.setItem(key, newValue);
        setValue(newValue);
        window.dispatchEvent(new CustomEvent('storageChange', {
            detail: { key, value: newValue }
        }));
    };

    return [value, updateValue] as const;
}