import { apiCall } from "@/utils/apiClient";
import { DirectSale, DirectSaleFormType, DirectSaleApiResponse } from '../types/directSale.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import axios from "axios";

export interface GetDirectSaleParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class DirectSaleService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: DirectSaleApiResponse): boolean {
    if (!response) {
      toast.error("No response from server");
      return false;
    }

    if (!response.success) {
      const message = response.message || "Something went wrong";

      toast.error(message);

      return false;
    }

    return true;
  }

  async getAllDirectSales(
    params: GetDirectSaleParams
  ): Promise<DirectSale[]> {
    try {
      const response = await apiCall.get<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        params
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Direct Sales:", error);
      toast.error(error.message || "Failed to fetch Direct Sales");
      throw error;
    }
  }

  async getDirectSaleById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<DirectSale> {
    try {

      const response = await apiCall.get<DirectSaleApiResponse>(
        `${this.baseUrl}sale/id`,
        params
      );

      this.handleError(response);

      const DirectSale = response.data?.[0];
      if (!DirectSale) throw new Error("Direct Sale not found");

      return DirectSale;

    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : String(error);

      toast.error(`Error fetching Direct Sale: ${message}`);
      throw new Error(message);
    }
  }

  async createDirectSale(data: DirectSaleFormType): Promise<DirectSaleApiResponse> {
    try {
      const response = await apiCall.post<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Direct Sale:", error);
      toast.error(error.message || "Failed to create Direct Sale");
      throw error;
    }
  }

  async updateDirectSale(id: number, data: Partial<DirectSaleFormType>): Promise<DirectSaleApiResponse> {
    try {
      const response = await apiCall.put<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update Direct Sale");

      return response;

    } catch (error: any) {
      console.error(`Error updating Direct Sale with id ${id}:`, error);
      toast.error(error.message || "Failed to update Direct Sale");
      throw error;
    }
  }

  async deleteDirectSale(
    params: {
      userid: number;
      compid: number;
      id: number;
    }
  ): Promise<void> {
    try {
      const { id, userid, compid } = params;
      const response = await apiCall.delete<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        {
          userid,
          compid,
          id,
        }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting Direct Sale with id ${params.id}:`, error);
      toast.error(error.message || "Failed to delete Direct Sale");
      throw error;
    }
  }

  async approveDirectSale(data: DirectSaleFormType): Promise<DirectSaleApiResponse> {
    try {
      const response = await apiCall.put<DirectSaleApiResponse>(
        `${this.baseUrl}sale/approve`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Direct Sale:", error);
      toast.error(error.message || "Failed to create Direct Sale");
      throw error;
    }
  }

  async getSaleBillPrintById(id: number | undefined, withRate: string): Promise<Blob> {
    const token = localStorage.getItem("accessToken") || "";
    try {
      const response = await axios.get(
        `${this.baseUrl}sale/print/pdf`,
        {
          params: {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            billid: id,
            withRate: withRate,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      console.error("Error fetching Sale bill print:", error);
      throw error;
    }
  }


}

export const directSaleService = new DirectSaleService();