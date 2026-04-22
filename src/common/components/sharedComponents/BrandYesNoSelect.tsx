'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface BrandYesNoSelectProps {
  value: any;
  onValueChanged: (e: { value: 'Yes' | 'No' }) => void;
  disabled?: boolean;
  className?: string;
}

const OPTIONS: { value: 'Yes' | 'No'; label: string }[] = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

function normalizeValue(val: any): 'Yes' | 'No' {
  if (val === 'No' || val === 'N' || val === false || val === 0) {
    return 'No';
  }
  return 'Yes';
}

export default function BrandYesNoSelect({
  value,
  onValueChanged,
  disabled = false,
  className = '',
}: BrandYesNoSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const displayValue = normalizeValue(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      {/* Pill Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-100 text-sm font-medium
        `}
      >
        <span className="text-sm whitespace-nowrap">
          Brand :
        </span>

        <span className="text-sm font-medium ">
          {displayValue}
        </span>

        <ChevronDown
          size={14}
          className={`ml-1 text-gray-600 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute left-0 top-full mt-1 z-3 border bg-white rounded min-w-full">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onValueChanged({ value: opt.value });
                setOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm bg-white
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
