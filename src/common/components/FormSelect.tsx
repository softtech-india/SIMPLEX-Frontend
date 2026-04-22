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
}: FormSelectProps<T, V>) {


  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption =
          options.find(
            (opt) => String(opt.value) === String(field.value)
          ) || null;

        return (
          <div className="flex flex-col gap-1">
            <Select
              options={options}
              value={selectedOption}
              onChange={(val: Option<V> | null) => {
                field.onChange(val?.value ?? null); // ✅ update form
                onChange?.(val);                   // ✅ trigger your logic (HSN → GST)
              }}
              onBlur={field.onBlur}
              isDisabled={isDisabled}
              isClearable={isClearable}
              isLoading={isLoading}
              placeholder={placeholder}
              className={className}
              classNamePrefix="react-select"
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />

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