import { ReactNode } from "react";

export interface DialogMuiProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: () => void;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export interface DialogHeaderProps {
  children: ReactNode;
}

export interface DialogTitlePropsMui {
  children: ReactNode;
}

export interface DialogContentPropsMui {
  children: ReactNode;
}
