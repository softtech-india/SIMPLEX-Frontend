"use client";
import { useRef } from "react";

interface Props {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function OtpInput({ length = 6, value, onChange }: Props) {

  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, val: string) => {

    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: any) => {

    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }

  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {

    const paste = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    onChange(newOtp);

    newOtp.forEach((_, i) => {
      if (inputs.current[i]) inputs.current[i]!.value = newOtp[i];
    });

  };

  return (

    <div className="flex justify-center gap-3">

      {Array.from({ length }).map((_, i) => (

        <input
          key={i}
          type="text"
          maxLength={1}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      ))}

    </div>

  );
}