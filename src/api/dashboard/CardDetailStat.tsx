import { apiCall } from "@/utils/apiClient";

export interface DashboardDetailsParams {
  userid: string;
  compid: string;
  startdt: string;
  enddt: string;
  type: string;
}

interface DashboardDetailsResponse {
  response: string;
  errorMessage: string;
  data: {
    name: string;
    value: number;
  }[];
}


export interface PurchaseDetailsParams {
  userid: string;
  compid: string;
  startdt: string;
  enddt: string;
  type: string;
}

export interface PurchaseDetailsResponse {
  response: string;
  errorMessage: string;
  data: {
    segment: string;
    total: number;
    brands: {
      brand: string;
      value: number;
    }[];
  }[];
}

export interface PurchaseProductDetailsParams {
  userid: string;
  compid: string;
  startdt: string;
  enddt: string;
  type: string | string[] | undefined;
  segmentid: string | string[] | undefined;
  brandid: string | string[] | undefined;
}

export interface PurchaseProductDetailsResponse {
  response: string;
  errorMessage: string;
  data: {
    name: string;
    value: number;
    qty: number;
  }[];
}


export const fetchDashboardDetails = async (
  params: DashboardDetailsParams
) => {
  try {
    const response = await apiCall.get<DashboardDetailsResponse>(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}dashboard/details`,
      params
    );

    return response?.data ?? [];
  } catch (err) {
    console.error("Error fetching dashboard details:", err);
    throw err;
  }
};

export const fetchPurchaseDetails = async (
  params: PurchaseDetailsParams
) => {
  try {
    const response = await apiCall.get<PurchaseDetailsResponse>(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}dashboard/purdetails`,
      params
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching purchase details:", err);
    throw err;
  }
};

export const fetchPurchaseProductDetails = async (
  params: PurchaseProductDetailsParams
) => {
  try {
    const response = await apiCall.get<PurchaseProductDetailsResponse>(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}dashboard/purproductdetails`,
      params
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching purchase details:", err);
    throw err;
  }
};