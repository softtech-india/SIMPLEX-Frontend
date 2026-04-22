"use client";
import React from "react";
import { CardMuiProps } from "./cardMui.model";
import styles from "./cardMui.module.css";
import clsx from "clsx";
import { Card, CardContent } from "@mui/material";

const CardMui: React.FC<CardMuiProps> = ({
  title,
  children,
  className,
  onClick,
  hoverEffect = false,
}) => {
  const cardClass = clsx(styles.card, hoverEffect && styles.hover, className);

  return (
    <Card className={cardClass} onClick={onClick}>
      <CardContent>
        {title && <div className={styles.title}>{title}</div>}
        {children}
      </CardContent>
    </Card>
  );
};

export default CardMui;
