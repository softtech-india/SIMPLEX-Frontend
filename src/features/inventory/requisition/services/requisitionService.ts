import { apiCall } from "@/utils/apiClient";
import { Requisition, RequisitionFormType, RequisitionApiResponse } from '../types/requisition.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

export interface GetRequisitionParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class RequisitionService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: RequisitionApiResponse): boolean {
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

  async getAllGodowns(branchId: number): Promise<any[]> {
    try {
      const response = await apiCall.get<any[]>(
        `${this.baseUrl}godown`,
        { userid: this.getUserId(), compid: this.getCompanyId(), branchid: branchId }
      );
      return response || [];
    } catch (error: any) {
      console.error("Error fetching godown:", error);
      toast.error(error.message || "Failed to fetch godown");
      throw error;
    }
  }

  async getAllBranches(): Promise<any[]> {
    try {
      const response = await apiCall.get<any[]>(
        `${this.baseUrl}branch`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response || [];
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      toast.error(error.message || "Failed to fetch branches");
      throw error;
    }
  }

  async getAllRequisitions(
    params: GetRequisitionParams
  ): Promise<Requisition[]> {
    try {
      const response = await apiCall.get<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
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

  async getRequisitionById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<Requisition> {
    try {

      const response = await apiCall.get<RequisitionApiResponse>(
        `${this.baseUrl}requisition/id`,
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

  async createRequisition(data: RequisitionFormType): Promise<RequisitionApiResponse> {
    try {
      const response = await apiCall.post<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
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

  async updateRequisition(id: number, data: Partial<RequisitionFormType>): Promise<RequisitionApiResponse> {
    try {
      const response = await apiCall.put<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
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

  async deleteRequisition(id: number): Promise<void> {
    try {
      const response = await apiCall.delete<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting purchaseOrder with id ${id}:`, error);
      toast.error(error.message || "Failed to delete purchaseOrder");
      throw error;
    }
  }

  async approveRequisition(data: RequisitionFormType): Promise<RequisitionApiResponse> {
    try {
      const response = await apiCall.put<RequisitionApiResponse>(
        `${this.baseUrl}requisition/approve`,
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


}

export const requisitionService = new RequisitionService();