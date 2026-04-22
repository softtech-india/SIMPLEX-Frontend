
export interface DatePickerDevProps {
  label?: string;                   // Label text above picker
  value: Date | undefined;        // Selected value          
  onValueChange: (value: Date) => void; // Callback when date changes
  placeholder?: string;             // Placeholder text
  disabled?: boolean;               // Disable state
  width?: number | string;          // Width of the component
  min?: Date;                       // Minimum selectable date
  max?: Date;                       // Maximum selectable date
  displayFormat?: string;           // Date format 
  type?: "date" | "time" | "datetime"; 
}
