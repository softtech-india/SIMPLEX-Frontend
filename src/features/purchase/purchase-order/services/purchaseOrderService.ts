import { apiCall } from "@/utils/apiClient";
import { PurchaseOrder, PurchaseOrderFormType, PurchaseOrderApiResponse } from '../types/purchaseOrder.types';
import { toast } from "sonner";
import axios from "axios";
import { storageService } from "@/common/utility/storageService";

export interface GetPurchaseOrderParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class PurchaseOrderService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: PurchaseOrderApiResponse): boolean {
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

  async getAllPurchaseOrders(
    params: GetPurchaseOrderParams
  ): Promise<PurchaseOrder[]> {
    try {
      const response = await apiCall.get<PurchaseOrderApiResponse>(
        `${this.baseUrl}po`,
        params
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching purchase orders:", error);
      toast.error(error.message || "Failed to fetch purchase orders");
      throw error;
    }
  }

  async getPurchaseOrderById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<PurchaseOrder> {
    try {

      const response = await apiCall.get<PurchaseOrderApiResponse>(
        `${this.baseUrl}po/id`,
        params
      );

      this.handleError(response);

      const purchaseOrder = response.data?.[0];
      if (!purchaseOrder) throw new Error("Purchase order not found");

      return purchaseOrder;

    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : String(error);

      toast.error(`Error fetching purchase order: ${message}`);
      throw new Error(message);
    }
  }

  async createPurchaseOrder(data: PurchaseOrderFormType): Promise<PurchaseOrderApiResponse> {
    try {
      const response = await apiCall.post<PurchaseOrderApiResponse>(
        `${this.baseUrl}po`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating purchaseOrder:", error);
      toast.error(error.message || "Failed to create purchaseOrder");
      throw error;
    }
  }

  async updatePurchaseOrder(id: number, data: Partial<PurchaseOrderFormType>): Promise<PurchaseOrderApiResponse> {
    try {
      const response = await apiCall.put<PurchaseOrderApiResponse>(
        `${this.baseUrl}po`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updatepurchaseOrder");

      return response;

    } catch (error: any) {
      console.error(`Error updating purchaseOrder with id ${id}:`, error);
      toast.error(error.message || "Failed to update purchaseOrder");
      throw error;
    }
  }

  async deletePurchaseOrder(
    params: {
      id: number;
      userid: number;
      compid: number;
    }
  ): Promise<void> {
    try {
      const { id, userid, compid } = params;
      const response = await apiCall.delete<PurchaseOrderApiResponse>(
        `${this.baseUrl}po`,
        {
          id,
          userid,
          compid,
        }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting purchaseOrder with id ${params.id}:`, error);
      toast.error(error.message || "Failed to delete purchase Order");
      throw error;
    }
  }

  async approvePurchaseOrder(data: PurchaseOrderFormType): Promise<PurchaseOrderApiResponse> {
    try {
      const response = await apiCall.put<PurchaseOrderApiResponse>(
        `${this.baseUrl}po/approve`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating purchaseOrder:", error);
      toast.error(error.message || "Failed to create purchaseOrder");
      throw error;
    }
  }

  async getPurchaseOrderPrintById(
    id: string | number | undefined
  ): Promise<Blob> {
    const token = localStorage.getItem("accessToken") || "";
    try {

      if (
        id === undefined ||
        id === null ||
        id === "" ||
        Number(id) === 0
      ) {
        throw new Error("Purchase Order ID must be greater than 0.");
      }

      const response = await axios.get(
        `${this.baseUrl}po/qr`,
        {
          params: {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            id: id,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error printing purchase order: ${message}`);
      throw new Error(message);
    }
  }


}

export const purchaseOrderService = new PurchaseOrderService();