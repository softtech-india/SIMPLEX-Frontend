export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = String(d.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`; // "10/Jan/2026" 
};

export const toInputDate = (date: Date): string => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`; // "2026-01-10" 
};

export const toDate = (str: string): Date => {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day); // local time, no timezone shift
};


export const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split("/");
  if (parts.length !== 3) return new Date();
  const [day, month, year] = parts;
  const monthIndex = new Date(`${month} 1`).getMonth();
  return new Date(Number(year), monthIndex, Number(day));
};

export const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
};

export const formatDatetoTwoDigitDisplay = (date: Date): string => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const day: string = date.getDate().toString().padStart(2, "0");
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const year: string = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
};