import { apiCall } from "@/utils/apiClient";
import { Branch, BranchFormData, BranchApiResponse } from '../types/branch.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class BranchService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: BranchApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }

  async getAllBranch(): Promise<Branch[]> {
    try {
      const response = await apiCall.get<BranchApiResponse>(
        `${this.baseUrl}branch`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching companies:", error);
      toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getBranchById(id: number): Promise<Branch> {
    try {
      const response = await apiCall.get<BranchApiResponse>(
        `${this.baseUrl}branch/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const branch = response.data?.[0];
      if (!branch) throw new Error("Branch not found");

      return branch;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching branch with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createBranch(data: BranchFormData): Promise<BranchApiResponse> {
    try {
      const response = await apiCall.post<BranchApiResponse>(
        `${this.baseUrl}branch`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating branch:", error);
      toast.error(error.message || "Failed to create branch");
      throw error;
    }
  }

  async updateBranch(id: number, data: Partial<BranchFormData>): Promise<BranchApiResponse> {
    try {
      const response = await apiCall.put<BranchApiResponse>(
        `${this.baseUrl}branch`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateBranch");

      return response;

    } catch (error: any) {
      console.error(`Error updating branch with id ${id}:`, error);
      toast.error(error.message || "Failed to update branch");
      throw error;
    }
  }

  async deleteBranch(id: number): Promise<void> {
    try {
      const response = await apiCall.delete<BranchApiResponse>(
        `${this.baseUrl}branch`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting branch with id ${id}:`, error);
      toast.error(error.message || "Failed to delete branch");
      throw error;
    }
  }
}

export const branchService = new BranchService();