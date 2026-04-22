export interface ButtonMuiProps {
  label: string;                // Button text
  onClick?: () => void;         // Click handler
  disabled?: boolean;           // Disabled state
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined" | "text"; // Style variant
  color?: "primary" | "secondary" | "danger"; // Color theme
  className?: string;           // Optional extra class
}
