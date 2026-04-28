'use client';

import Select, { StylesConfig } from "react-select";

type Option<T = string | number> = {
  value: T;
  label: string;
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
  const selectedOption =
    options.find((opt) => opt.value === value) ?? null;

  const compactStyles: StylesConfig<Option<T>, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 30,
      height: 30,
      borderRadius: 6,
      fontSize: 12,
      borderColor: state.isFocused ? "#60a5fa" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #60a5fa" : "none",
      "&:hover": {
        borderColor: "#60a5fa",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 30,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: 4,
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: 4,
    }),
    menu: (base) => ({
      ...base,
      fontSize: 12,
      zIndex: 50,
    }),
    option: (base, state) => ({
      ...base,
      padding: "6px 8px",
      fontSize: 12,
      backgroundColor: state.isFocused ? "#eff6ff" : "white",
      color: "#111827",
    }),
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(val) => onChange?.(val as Option<T> | null)}
      isDisabled={isDisabled}
      isClearable={isClearable}
      isLoading={isLoading}
      isSearchable
      placeholder={placeholder}
      className={className}
      classNamePrefix="react-select"
      styles={compactStyles}
      menuPortalTarget={
        typeof window !== "undefined" ? document.body : null
      }
      menuPosition="fixed"
    />
  );
}