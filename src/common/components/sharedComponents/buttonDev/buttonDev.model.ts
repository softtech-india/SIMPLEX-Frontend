// buttonDev.model.ts
// export interface ButtonDevProps {
//   text: string;                  // Button label
//   type?: "normal" | "default" | "success" | "danger"; // DevExtreme button types
//   stylingMode?: "contained" | "outlined" | "text";   // Styling mode
//   icon?: string;                 // Optional icon name
//   disabled?: boolean;            // Disable state
//   onClick?: () => void;          
//   className?: string;            
//   width: number;
//   useSubmitBehavior?: boolean; // If true, button acts as a submit button
// }


export type ButtonGradient =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "red";

export interface ButtonDevProps {
  text: string;
  width: number;
  type?: "normal" | "default" | "success" | "danger";
  stylingMode?: "contained" | "outlined" | "text";
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  useSubmitBehavior?: boolean; // If true, button acts as a submit button
  gradient?: ButtonGradient; // 👈 ADD THIS
  hint?: string;
}
