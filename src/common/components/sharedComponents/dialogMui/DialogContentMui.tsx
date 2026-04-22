import React, { ReactNode } from "react";
import { DialogContent } from "@mui/material";
import { DialogContentPropsMui } from "./dialogMui.model";
import styles from "./dialogMui.module.css";

const DialogContentMui: React.FC<DialogContentPropsMui> = ({ children }) => {
  return <DialogContent className={styles.dialogContent}>{children}</DialogContent>;
};

export default DialogContentMui;
