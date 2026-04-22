"use client";
import { useRef, useEffect } from "react";

interface Props {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  autoFocus = true,
}: Props) {
  
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      inputs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    // Move forward
    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "Backspace":
        if (!value[index] && index > 0) {
          inputs.current[index - 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) inputs.current[index - 1]?.focus();
        break;

      case "ArrowRight":
        if (index < length - 1) inputs.current[index + 1]?.focus();
        break;

      default:
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!paste) return;

    const newOtp = paste.split("");
    const paddedOtp = [...newOtp, ...Array(length - newOtp.length).fill("")];

    onChange(paddedOtp);

    // Focus last filled input
    const lastIndex = newOtp.length - 1;
    if (lastIndex >= 0) {
      inputs.current[lastIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div
      className="flex justify-center gap-3"
      role="group"
      aria-label="OTP Input"
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          aria-label={`Digit ${i + 1}`}
          className="w-10 h-10 text-center text-lg border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}