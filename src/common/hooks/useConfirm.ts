import { useContext } from "react";
import { ConfirmContext } from "../providers/ConfirmProvider";

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};