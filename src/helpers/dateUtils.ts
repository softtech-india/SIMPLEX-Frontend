export const currentDate = new Date().toISOString().split("T")[0];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Formats date to "DD/MMM/YYYY"
// Example: 06/Aug/2026, 19/Sep/2026
export const formatDate = (date: Date | string | null): string => {
  if (!date) return "";
  if (typeof date === "string") {
    const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [, year, month, day] = m;
      return `${day}/${MONTHS[Number(month) - 1]}/${year}`;
    }
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${day}/${MONTHS[dateObj.getMonth()]}/${dateObj.getFullYear()}`;
};

// export function formatDate(date: string | null | undefined): string {
//   if (!date) return "";

//   const d = new Date(date);

//   if (isNaN(d.getTime())) return "";

//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();

//   return `${day}-${month}-${year}`;
// }

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
