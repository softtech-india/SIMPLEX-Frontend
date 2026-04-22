import React from "react";
import TextField from "@mui/material/TextField";
import styles from "./InputMui.module.css";
import { InputMuiProps } from "./inputMui.model";

const InputMui: React.FC<InputMuiProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = false,
  helperText = "",
  fullWidth = true,
}) => {
  return (
    <div className={styles.inputContainer}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        variant="outlined"
        className={styles.inputField}
      />
    </div>
  );
};

export default InputMui;
