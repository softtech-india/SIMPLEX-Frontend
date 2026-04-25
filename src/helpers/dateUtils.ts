export const currentDate = new Date().toISOString().split("T")[0];

export function formatDate(date: string | null): string {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}

export const formatDateForInput = (
  date?: string | Date | null
): string => {
  if (!date) return "";

  if (typeof date === "string") {
    if (date.includes("T")) {
      return date.split("T")[0]; 
    }
    return date;
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
