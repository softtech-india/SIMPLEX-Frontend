import React, { ReactNode } from "react";
import MuiDialog from "@mui/material/Dialog";
// import { DialogMuiProps } from "./DialogMui.model";
import styles from "./dialogMui.module.css";
import { DialogMuiProps } from "./dialogMui.model";

// const DialogMui: React.FC<DialogMuiProps> = ({
//   open,
//   onClose,
//   onOpenChange,
//   children,
//   fullWidth = true,
//   maxWidth = "sm",
// }) => {
//   return (
//     <MuiDialog
//       open={open}
//       onClose={onClose}

//       fullWidth={fullWidth}
//       maxWidth={maxWidth}
//       className={styles.dialog}
//     >
//       {children}
//     </MuiDialog>
//   );
// };

const DialogMui: React.FC<DialogMuiProps> = ({
  open,
  onClose,
  onOpenChange,
  children,
  fullWidth = true,
  maxWidth = "sm",
}) => {
  const handleClose = () => {
    onClose();
    onOpenChange?.();
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      className={styles.dialog}
    >
      {children}
    </MuiDialog>
  );
};


export default DialogMui;
