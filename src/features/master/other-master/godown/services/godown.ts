import { apiCall } from "@/utils/apiClient";
import { Godown, GodownFormData, GodownApiResponse, Branch, BranchApiResponse } from '../types/godown.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class GodownService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };


  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: GodownApiResponse | BranchApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }




  async getAllGodowns(): Promise<Godown[]> {
    try {
      const response = await apiCall.get<GodownApiResponse>(
        `${this.baseUrl}godown`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All Godown:", error);
      toast.error(error.message || "Failed to fetch Godown");
      throw error;
    }
  }
  async getAllBranches(): Promise<Branch[]> {
    try {
      const response = await apiCall.get<BranchApiResponse>(
        `${this.baseUrl}branch`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All Godown:", error);
      toast.error(error.message || "Failed to fetch Godown");
      throw error;
    }
  }



  async getProdGodownById(id: number): Promise<Godown> {
    try {
      const response = await apiCall.get<GodownApiResponse>(
        `${this.baseUrl}godown/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const godown = response.data?.[0];
      if (!godown) throw new Error("Godown not found");

      return godown;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching Godown with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createGodown(data: GodownFormData): Promise<GodownApiResponse> {
    try {
      const response = await apiCall.post<GodownApiResponse>(
        `${this.baseUrl}godown`,
        data
        ,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Godown:", error);
      toast.error(error.message || "Failed to create Godown");
      throw error;
    }
  }

  async updateGodown(id: number, data: Partial<GodownFormData>): Promise<GodownApiResponse> {
    try {
      const response = await apiCall.put<GodownApiResponse>(
        `${this.baseUrl}godown`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update godown");

      return response;

    } catch (error: any) {
      console.error(`Error updating godown with id ${id}:`, error);
      toast.error(error.message || "Failed to update godown");
      throw error;
    }
  }

  async deleteGodown(id: number): Promise<GodownApiResponse> {
    try {
      const response = await apiCall.delete<GodownApiResponse>(
        `${this.baseUrl}godown`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error(`Error deleting hsn with id ${id}:`, error);
      toast.error(error.message || "Failed to delete hsn");
      throw error;
    }
  }
}

export const godownService = new GodownService();