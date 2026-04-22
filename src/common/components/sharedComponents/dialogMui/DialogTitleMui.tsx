import React from "react";
import { DialogTitle } from "@mui/material";
import { DialogTitlePropsMui } from "./dialogMui.model";
import styles from "./dialogMui.module.css";

const DialogTitleMui: React.FC<DialogTitlePropsMui> = ({ children }) => {
  return <DialogTitle className={styles.dialogTitle}>{children}</DialogTitle>;
};

export default DialogTitleMui;
