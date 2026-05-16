import Select from "react-select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

type Option<T = string | number> = {
  value: T;
  label: string;
};

interface FormSelectProps<T extends FieldValues, V = string | number> {
  name: Path<T>;
  control: Control<T>;
  options: Option<V>[];
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  className?: string;
  onChange?: (option: Option<V> | null) => void;
  tabIndex?: number;
}

export function FormSelect<T extends FieldValues, V = string | number>({
  name,
  control,
  options,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  isClearable = true,
  isLoading = false,
  className,
  tabIndex,
}: FormSelectProps<T, V>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // const selectedOption =
        //   options.find(
        //     (opt) => String(opt.value) === String(field.value)
        //   ) || null;

        const selectedOption = options.find((opt) => opt.value === field.value) || null;

        return (
          <div className="flex flex-col gap-1">
            <Select
              options={options}
              value={selectedOption}
              onChange={(val: Option<V> | null) => {
                // IMPORTANT: use "" instead of null for validation
                field.onChange(val?.value ?? "");
                onChange?.(val);
              }}
              tabIndex={tabIndex}
              onBlur={field.onBlur}
              isDisabled={isDisabled}
              isClearable={isClearable}
              isLoading={isLoading}
              placeholder={placeholder}
              classNamePrefix="react-select"
              className={className}
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: fieldState.error
                    ? "#fb2c36"
                    : state.isFocused
                      ? "#2563eb"
                      : "#9ca3af",
                  "&:hover": {
                    borderColor: fieldState.error
                      ? "#fb2c36"
                      : "#6b7280",
                  },
                  boxShadow: fieldState.error
                    ? "0 0 0 1px red"
                    : state.isFocused
                      ? "0 0 0 1px #2563eb"
                      : base.boxShadow,
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />

            {/* ✅ Error message */}
            {fieldState.error && (
              <span className="text-red-500 text-sm">
                {fieldState.error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
}