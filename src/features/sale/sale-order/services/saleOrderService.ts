import { apiCall } from "@/utils/apiClient";
import { SaleOrder, SaleOrderFormType, SaleOrderApiResponse } from '../types/saleOrder.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import axios from "axios";

export interface GetSaleOrderParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class SaleOrderService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: SaleOrderApiResponse): boolean {
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

  async getAllSaleOrders(
    params: GetSaleOrderParams
  ): Promise<SaleOrder[]> {
    try {
      const response = await apiCall.get<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        params
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Sale orders:", error);
      toast.error(error.message || "Failed to fetch Sale orders");
      throw error;
    }
  }

  async getSaleOrderById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<SaleOrder> {
    try {

      const response = await apiCall.get<SaleOrderApiResponse>(
        `${this.baseUrl}so/id`,
        params
      );

      this.handleError(response);

      const SaleOrder = response.data?.[0];
      if (!SaleOrder) throw new Error("Sale order not found");

      return SaleOrder;

    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : String(error);

      toast.error(`Error fetching Sale order: ${message}`);
      throw new Error(message);
    }
  }

  async createSaleOrder(data: SaleOrderFormType): Promise<SaleOrderApiResponse> {
    try {
      const response = await apiCall.post<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating SaleOrder:", error);
      toast.error(error.message || "Failed to create Sale Order");
      throw error;
    }
  }

  async updateSaleOrder(id: number, data: Partial<SaleOrderFormType>): Promise<SaleOrderApiResponse> {
    try {
      const response = await apiCall.put<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update Sale Order");

      return response;

    } catch (error: any) {
      console.error(`Error updating SaleOrder with id ${id}:`, error);
      toast.error(error.message || "Failed to update Sale Order");
      throw error;
    }
  }

  async deleteSaleOrder(
    params: {
      id: number;
      userid: number;
      compid: number;
    }
  ): Promise<void> {
    try {
      const { id, userid, compid } = params;
      const response = await apiCall.delete<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        {
          id,
          userid,
          compid,
        }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting SaleOrder with id ${params.id}:`, error);
      toast.error(error.message || "Failed to delete Sale Order");
      throw error;
    }
  }

  async approveSaleOrder(data: SaleOrderFormType): Promise<SaleOrderApiResponse> {
    try {
      const response = await apiCall.put<SaleOrderApiResponse>(
        `${this.baseUrl}so/approve`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Sale Order:", error);
      toast.error(error.message || "Failed to create Sale Order");
      throw error;
    }
  }

  async getTbillPrintById(id: number | undefined, withrate: string): Promise<Blob> {
    const token = localStorage.getItem("accessToken") || "";
    try {
      const response = await axios.get(
        `${this.baseUrl}so/print/pdf`,
        {
          params: {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            id: id,
            withrate: withrate,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      console.error("Error fetching Delivery Challan print:", error);
      throw error;
    }
  }



}

export const saleOrderService = new SaleOrderService();