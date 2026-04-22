"use client";

import { X } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

type ConfirmOptions = {
  title?: string;
  message?: string;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (options: ConfirmOptions) => {
    setOptions(options);
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setOpen(false);
  };

  const handleCancel = () => {
    resolver?.(false);
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}l

      {/* Global Modal */}
      {open && (
        <div className="fixed inset-0 z-101 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          {/* Modal Card */}
          <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {options.title || "Confirm Action"}
              </h3>

              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-700 transition"
              >
              <X />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                {options.message || "Are you sure you want to continue this action?"}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">

              <button
                onClick={handleCancel}
                className="secondary-btn"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="delete-btn"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};