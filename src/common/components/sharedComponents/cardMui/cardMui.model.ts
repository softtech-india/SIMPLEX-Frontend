export interface CardMuiProps {
  title?: string;           // Optional card title
  children: React.ReactNode; // Content inside the card
  className?: string;       // Extra CSS classes
  onClick?: () => void;     // Click handler
  hoverEffect?: boolean;    // Enable hover shadow effect
}
