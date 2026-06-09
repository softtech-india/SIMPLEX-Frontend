import { FieldErrors } from "react-hook-form";

export const getFormErrorMessage = (
  errors: FieldErrors
): string | null => {
  const findError = (obj: unknown): string | null => {
    if (!obj || typeof obj !== "object") return null;

    if (
      "message" in obj &&
      typeof (obj as { message?: unknown }).message === "string"
    ) {
      return (obj as { message: string }).message;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const message = findError(item);
        if (message) return message;
      }
    } else {
      for (const value of Object.values(obj)) {
        const message = findError(value);
        if (message) return message;
      }
    }

    return null;
  };

  return findError(errors);
};