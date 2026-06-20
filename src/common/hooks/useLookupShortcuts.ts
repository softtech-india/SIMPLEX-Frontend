import React from "react";

type LookupMap = Record<string, () => void>;

export function useLookupShortcuts(
    isReadOnly: boolean,
    map: LookupMap
) {
    return (key: string) => ({
        onKeyDown: (e: React.KeyboardEvent) => {
            if (isReadOnly) return;

            // open modal on these keys
            if ([" ", "Enter", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                map[key]?.();
            }

        },
    });
}