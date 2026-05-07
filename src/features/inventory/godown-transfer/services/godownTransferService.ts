import { apiCall } from "@/utils/apiClient";
import {
  GodownTransfer,
  GodownTransferFormType,
  GodownTransferApiResponse,
} from "../types/godowntransfer.types";

import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

export interface GetGodownTransferParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class GodownTransferService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string =>
    this.getFromStorage("userId");

  private getCompanyId = (): string =>
    this.getFromStorage("companyId");

  private handleError(
    response: GodownTransferApiResponse
  ): boolean {
    if (!response) {
      toast.error("No response from server");
      return false;
    }

    if (!response.success) {
      const message =
        response.message || "Something went wrong";

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



  async getAllGodownTransfers(
    params: GetGodownTransferParams
  ): Promise<GodownTransfer[]> {
    try {
      const response =
        await apiCall.get<GodownTransferApiResponse>(
          `${this.baseUrl}gt`,
          params
        );

      return response.data || [];
    } catch (error: any) {
      console.error(
        "Error fetching godown transfers:",
        error
      );

      toast.error(
        error.message ||
        "Failed to fetch godown transfers"
      );

      throw error;
    }
  }

  async getGodownTransferById(params: {
    id: number;
    userid: number;
    compid: number;
    branchid: number | string;
    finid: number;
  }): Promise<GodownTransfer> {
    try {
      const response =
        await apiCall.get<GodownTransferApiResponse>(
          `${this.baseUrl}gt/id`,
          params
        );

      this.handleError(response);

      const godownTransfer = response.data?.[0];

      if (!godownTransfer) {
        throw new Error("Godown transfer not found");
      }

      return godownTransfer;
    } catch (error: any) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      toast.error(
        `Error fetching godown transfer: ${message}`
      );

      throw new Error(message);
    }
  }

  async createGodownTransfer(
    data: GodownTransferFormType
  ): Promise<GodownTransferApiResponse> {
    try {
      const response =
        await apiCall.post<GodownTransferApiResponse>(
          `${this.baseUrl}gt`,
          data,
          { userid: this.getUserId() }
        );

      this.handleError(response);

      return response;
    } catch (error: any) {
      console.error(
        "Error creating godown transfer:",
        error
      );

      toast.error(
        error.message ||
        "Failed to create godown transfer"
      );

      throw error;
    }
  }

  async updateGodownTransfer(
    id: number,
    data: Partial<GodownTransferFormType>
  ): Promise<GodownTransferApiResponse> {
    try {
      const response =
        await apiCall.put<GodownTransferApiResponse>(
          `${this.baseUrl}gt`,
          { ...data, id },
          {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
          }
        );

      this.handleError(response);

      if (!response) {
        throw new Error(
          "Response not found at updateGodownTransfer"
        );
      }

      return response;
    } catch (error: any) {
      console.error(
        `Error updating godown transfer with id ${id}:`,
        error
      );

      toast.error(
        error.message ||
        "Failed to update godown transfer"
      );

      throw error;
    }
  }

  async deleteGodownTransfer(
    id: number
  ): Promise<void> {
    try {
      const response =
        await apiCall.delete<GodownTransferApiResponse>(
          `${this.baseUrl}gt`,
          {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            id,
          }
        );

      this.handleError(response);
    } catch (error: any) {
      console.error(
        `Error deleting godown transfer with id ${id}:`,
        error
      );

      toast.error(
        error.message ||
        "Failed to delete godown transfer"
      );

      throw error;
    }
  }
}

export const godownTransferService =
  new GodownTransferService();