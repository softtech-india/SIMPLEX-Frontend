export interface StockTrial {
  id: number;
  productid: number;
  productnm: string;
  productcode: string;
  opqty: number;
  recvqty: number;
  issuqty: number;
  clqty: number;
  clrate: number;
  clval: number;
  unit: string;
  brandnm: string;
  classnm: string;
  subclassnm: string;

  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}
export interface Brand {
  id: number | string;
  name: string;

  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}



export interface stockTrialApiResponse {
  success: boolean;
  message: string;
  data: StockTrial[];
}
export interface BrandApiResponse {
  success: boolean;
  message: string;
  data: Brand[];
}


export interface StockTrialParams {
  userid: number;
  compid: number;
  branchid?: number;
  printrtval: number;
  strbrand: string;
  finid?: number;
  startdt?: string;
  enddt?: string;
  strclass: string,
  strsubclass: string,
  balancetag: number,
  strgodown: string,
}


export interface StockTrialFilterParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;        // Format: "DD/MMM/YYYY" e.g., "31/Mar/2027"
  printrtval: number;   // 0 or 1
  strbrand: string;     // Can be space separated or comma separated IDs
  strclass: string;
  strsubclass: string;
  balancetag: number;   // 0 = Only Balance, 1 = All
  strgodown: string;
}

export interface StockTrialFilterState {
  // Core required params
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;

  printrtval: number;
  strbrand: string;
  strclass: string;
  strsubclass: string;
  balancetag: number;
  strgodown: string;
}


// Default values
const today = new Date().toISOString().split("T")[0];
export const DEFAULT_STOCK_TRIAL_FILTER: StockTrialFilterState = {
  userid: 0,
  compid: 0,
  branchid: 0,
  finid: 0,
  startdt: today,
  enddt: today,
  printrtval: 0,
  strbrand: ' ',
  strclass: ' ',
  strsubclass: ' ',
  balancetag: 1,
  strgodown: ' ',
};

// Helper function to format date to "DD/MMM/YYYY" (e.g., "01/Apr/2026")
export const formatDateForApi = (date: Date | string | null): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

// Helper to format date from "DD/MMM/YYYY" to Date object
export const parseDateFromApi = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${month} ${day}, ${year}`);
};

// Helper to build query string from filter params
export const buildStockTrialQueryString = (params: StockTrialFilterParams): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // For string values that might have spaces, encode them
      if (typeof value === 'string') {
        queryParams.append(key, encodeURIComponent(value));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  return queryParams.toString();
};

// Helper to build full URL
export const buildStockTrialUrl = (baseUrl: string, params: StockTrialFilterParams): string => {
  const queryString = buildStockTrialQueryString(params);
  return `${baseUrl}?${queryString}`;
};

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";