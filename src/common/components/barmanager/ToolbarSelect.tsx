'use client';

import Select from "react-select";

type Option<T = string | number> = {
  value: T;
  label: string;
};

type ToolbarSelect = {
  name: string;
  options: { value: string; label: string }[];
  label?: string;
  value?: string | null; 
  placeholder?: string;
  className?: string;
  onChange?: (value: string | null) => void; 
};


interface ToolbarSelectProps<T = string | number> {
  options: Option<T>[];
  value?: T | null; 
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  className?: string;
  onChange?: (option: Option<T> | null) => void;
}

export function ToolbarSelect<T = string | number>({
  options,
  value,
  placeholder = "Select...",
  isDisabled = false,
  isClearable = true,
  isLoading = false,
  className,
  onChange,
}: ToolbarSelectProps<T>) {

  // ensure strict match
  const selectedOption = options.find((opt) => opt.value === value) ?? null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(val) => {
        onChange?.(val as Option<T> | null);
      }}
      isDisabled={isDisabled}
      isClearable={isClearable}
      isLoading={isLoading}
      isSearchable
      placeholder={placeholder}
      className={className}
      classNamePrefix="react-select"
      menuPortalTarget={
        typeof window !== "undefined" ? document.body : null
      }
      menuPosition="fixed"
    />
  );
}