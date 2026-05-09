import { apiCall } from "@/utils/apiClient";
import {
  SalesMan,
  SalesManFormData,
  SalesManApiResponse,
} from "../types/salesman";

import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import useUserStore from "@/store/userStore";
const getUserStore = () => useUserStore.getState();

class SalesManService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: SalesManApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }

  async getAllBranch(): Promise<SalesMan[]> {
    try {
      const response = await apiCall.get<SalesManApiResponse>(
        `${this.baseUrl}branch`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      // this.handleError(response);

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching branch:", error);
      toast.error(error.message || "Failed to fetch branch list");
      throw error;
    }
  }

  async getAllSalesMan(branchId: string | null): Promise<SalesMan[]> {
    try {
      // Use passed branchId or fallback to store value
      const effectiveBranchId = branchId || getUserStore().branchId;

      const response = await apiCall.get<SalesManApiResponse>(
        `${this.baseUrl}salesman`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
          branchid: effectiveBranchId,
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching SalesMan list:", error);
      toast.error(error.message || "Failed to fetch SalesMan list");
      throw error;
    }
  }

  async getSalesManById(id: number): Promise<SalesMan> {
    try {
      const response = await apiCall.get<SalesManApiResponse>(
        `${this.baseUrl}salesman/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      // this.handleError(response);

      const hsn = response.data?.[0];
      if (!hsn) throw new Error("HSN not found");

      return hsn;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching HSN with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createSalesMan(data: SalesManFormData): Promise<SalesManApiResponse> {
    try {
      const response = await apiCall.post<SalesManApiResponse>(
        `${this.baseUrl}salesman`,
        data,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      // this.handleError(response);

      return response;
    } catch (error: any) {
      console.error("Error creating SalesMan:", error);
      toast.error(error.message || "Failed to create SalesMan");
      throw error;
    }
  }

  async updateSalesMan(id: number, data: Partial<SalesManFormData>): Promise<SalesManApiResponse> {
    try {
      const response = await apiCall.put<SalesManApiResponse>(
        `${this.baseUrl}salesman`,
        { ...data, id },
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      // this.handleError(response);

      if (!response) {
        throw new Error("Response not found while updating SalesMan");
      }

      return response;
    } catch (error: any) {
      console.error(`Error updating SalesMan with id ${id}:`, error);
      toast.error(error.message || "Failed to update SalesMan");
      throw error;
    }
  }

  async deleteSalesMan(id: number): Promise<SalesManApiResponse> {
    try {
      const response = await apiCall.delete<SalesManApiResponse>(
        `${this.baseUrl}salesman`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
          id,
        }
      );

      // this.handleError(response);

      return response;
    } catch (error: any) {
      console.error(`Error deleting SalesMan with id ${id}:`, error);
      toast.error(error.message || "Failed to delete SalesMan");
      throw error;
    }
  }
}

export const salesManService = new SalesManService();