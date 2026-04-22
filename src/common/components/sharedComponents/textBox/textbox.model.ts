import { TextBoxType } from "devextreme/ui/text_box";

export interface CustomTextBoxProps {
  value?: string | null;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange: (value: string | undefined) => void;
  label?: string;
  className?: string;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
  mode?: TextBoxType;
  inputRef?: React.MutableRefObject<any>; 
  type?: string
  
  
}