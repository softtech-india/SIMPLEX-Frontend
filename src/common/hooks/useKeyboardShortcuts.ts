'use client';

import { useEffect } from "react";

type ShortcutMap = {
  [key: string]: () => void;
};

export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // Ignore typing fields
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const parts = [];

      if (event.altKey) parts.push("ALT");
      if (event.ctrlKey) parts.push("CTRL");
      if (event.shiftKey) parts.push("SHIFT");

      parts.push(event.key.toUpperCase());

      const key = parts.join("+");

      const action = shortcuts[key];

      if (action) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [shortcuts, enabled]);
}