import Select from "react-select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

type Option<T = string | number> = {
  value: T;
  label: string;
};

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select...",
  isDisabled = false,
  isClearable = true,
  isLoading = false,
  className,
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption =
          options.find((opt) => opt.value === field.value) || null;

        return (
          <div className="flex flex-col gap-1">
            <Select
              options={options}
              value={selectedOption}
              onChange={(val) => field.onChange(val?.value ?? null)}
              onBlur={field.onBlur}
              isDisabled={isDisabled}
              isClearable={isClearable}
              isLoading={isLoading}
              placeholder={placeholder}
              className={className}
              classNamePrefix="react-select"
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