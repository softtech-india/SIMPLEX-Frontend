import React, { ReactNode } from "react";
// import { DialogHeaderProps } from "./DialogMui.model";
import styles from "./dialogMui.module.css";
import { DialogHeaderProps } from "./dialogMui.model";

const DialogHeaderMui: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className={styles.dialogHeader}>{children}</div>;
};

export default DialogHeaderMui;
