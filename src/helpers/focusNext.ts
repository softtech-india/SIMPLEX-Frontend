import type { RefObject } from "react";

type Focusable = HTMLElement | null | undefined;
type FocusTarget = RefObject<Focusable> | Focusable;

interface FocusNextOptions {
  select?: boolean;
  frames?: number;
  preventScroll?: boolean;
}

const resolve = (target: FocusTarget): HTMLElement | null => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  return (target as RefObject<Focusable>).current ?? null;
};

export const focusNext = (
  target: FocusTarget,
  { select = false, frames = 1, preventScroll = false }: FocusNextOptions = {}
): void => {
  const run = (remaining: number) => {
    requestAnimationFrame(() => {
      if (remaining > 1) return run(remaining - 1);

      const el = resolve(target);
      if (!el || (el as HTMLInputElement).disabled) return;

      el.focus({ preventScroll });

      if (select && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
        el.select();
      }
    });
  };

  run(Math.max(1, frames));
};

export default focusNext;