"use client";

import React from "react";
import { ButtonMuiProps } from "./buttonMui.model";
import styles from "./buttonMui.module.css";
import clsx from "clsx";

const ButtonMui: React.FC<ButtonMuiProps> = ({
  label,
  onClick,
  disabled = false,
  type = "button",
  variant = "contained",
  color = "primary",
  className,
}) => {
  const buttonClass = clsx(
    styles.button,
    styles[variant],
    styles[color],
    className
  );

  return (
    <button type={type} className={buttonClass} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default ButtonMui;
