"use client";

import { AlertTriangle, CheckCircle2, HelpCircle, Info, X } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ConfirmVariant = "danger" | "success" | "primary" | "warning";

export type ConfirmOptions = {
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmContextType | null>(null);

const VARIANT_STYLES: Record<
  ConfirmVariant,
  {
    button: string;
    iconWrap: string;
    icon: React.ElementType;
    defaultText: string;
  }
> = {
  danger: {
    button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
    iconWrap: "bg-red-100 text-red-600",
    icon: AlertTriangle,
    defaultText: "Delete",
  },
  success: {
    button: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500",
    iconWrap: "bg-green-100 text-green-600",
    icon: CheckCircle2,
    defaultText: "Save",
  },
  primary: {
    button: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
    iconWrap: "bg-blue-100 text-blue-600",
    icon: Info,
    defaultText: "Confirm",
  },
  warning: {
    button: "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400",
    iconWrap: "bg-amber-100 text-amber-600",
    icon: HelpCircle,
    defaultText: "Continue",
  },
};

export const ConfirmProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setOpen(false);
  }, []);

  const confirm = useCallback<ConfirmContextType>((opts) => {
    // Resolve any pending confirm so it doesn't hang
    resolverRef.current?.(false);

    setOptions(opts);
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  // Keyboard: Esc = cancel, Enter = confirm; autofocus confirm button
  useEffect(() => {
    if (!open) return;

    confirmBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      } else if (e.key === "Enter") {
        e.preventDefault();
        close(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const variant = options.variant ?? "primary";
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(false); // Backdrop click
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${styles.iconWrap}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3
                  id="confirm-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {options.title || "Confirm Action"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => close(false)}
                className="text-gray-400 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-6">
              <p
                id="confirm-message"
                className="text-sm text-gray-600 leading-relaxed whitespace-pre-line"
              >
                {options.message ||
                  "Are you sure you want to continue this action?"}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => close(false)}
                className="secondary-btn"
              >
                {options.cancelText || "Cancel"}
              </button>

              <button
                ref={confirmBtnRef}
                type="button"
                onClick={() => close(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles.button}`}
              >
                {options.confirmText || styles.defaultText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};