// export interface DropDownBoxOption {
//   value: string | number;
//   label: string;
// }

// export interface DropDownBoxProps {
//   label?: string;
//   options: DropDownBoxOption[] | any; // can be array or CustomStore
//   value: string | number | null;
//   placeholder?: string;
//   disabled?: boolean;
//   onChange: (value: string | number | null) => void;
//   width?: number | string;
// }

export interface DropDownBoxProps {
  label?: string;
  dataSource: any; // ✅ can be CustomStore or array
  value: string | number | null;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string | number | null) => void;
  width?: number | string;
}
