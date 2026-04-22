"use client";

import React from "react";
import { Button } from "devextreme-react/button";
import styles from "./buttonDev.module.css";
import type { ButtonDevProps,ButtonGradient  } from "./buttonDev.model";

const ButtonDev: React.FC<ButtonDevProps> = ({
    text,
    type = "normal",
    stylingMode = "contained",
    icon,
    disabled = false,
    onClick,
    className = "",
    width,
    useSubmitBehavior = false, // 👈 Add this
    gradient
}) => {
    const buttonClass = [
        styles.buttonWrapper,
        type === "success" ? styles.success : "",
        type === "danger" ? styles.danger : "",
        type === "default" ? styles.default : "",
        gradient ? styles[`gradient_${gradient}`] : "", 
        styles.primary,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={buttonClass}>
            <Button
                text={text}
                type={type}
                stylingMode={stylingMode}
                icon={icon}
                disabled={disabled}
                onClick={onClick}
                width={width}
                useSubmitBehavior={useSubmitBehavior} // 👈 Forward to inner Button
            />
        </div>
    );
};

export default ButtonDev;
