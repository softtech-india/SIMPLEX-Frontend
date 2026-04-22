'use client';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ToolbarDateSelectProps = {
  name: string;
  label?: string;
  value?: Date | null;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  dateFormat?: string;
  onChange?: (value: Date | null) => void; 
};

export function ToolbarDateSelect({
  name,
  label,
  value = null,
  placeholder = "Select date...",
  className = "",
  isDisabled = false,
  isClearable = true,
  dateFormat = "dd-MM-yyyy",
  onChange,
}: ToolbarDateSelectProps) {

  const handleChange = (date: Date | null) => {
    onChange?.(date);
  };

  return (
    <div className={className}>
      {/* {label && (
        <label className="block text-xs font-medium mb-1">
          {label}
        </label>
      )} */}

      <DatePicker
        name={name}
        selected={value}
        onChange={handleChange}
        placeholderText={placeholder}
        disabled={isDisabled}
        isClearable={isClearable}
        dateFormat={dateFormat}
        className="w-full border rounded px-3 py-2 text-sm bg-white"
        popperPlacement="bottom-start"
      />
    </div>
  );
}