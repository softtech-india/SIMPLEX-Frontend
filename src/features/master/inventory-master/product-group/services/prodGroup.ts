import { apiCall } from "@/utils/apiClient";
import { ProdGroup, ProdGroupFormData, ProdGroupApiResponse } from '../types/prodGroup.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class ProdGroupService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: ProdGroupApiResponse): boolean {
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


  async getAllProdGroups(): Promise<ProdGroup[]> {
    try {
      const response = await apiCall.get<ProdGroupApiResponse>(
        `${this.baseUrl}productsubclass`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      //this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching companies:", error);
      //toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getProdGroupById(id: number): Promise<ProdGroup> {
    try {
      const response = await apiCall.get<ProdGroupApiResponse>(
        `${this.baseUrl}productsubclass/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const classResponse = response.data?.[0];
      if (!classResponse) throw new Error("ProdGroup not found");

      return classResponse;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching class with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createProdGroup(data: ProdGroupFormData): Promise<ProdGroupApiResponse> {
    try {
      const response = await apiCall.post<ProdGroupApiResponse>(
        `${this.baseUrl}productsubclass`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating class:", error);
      toast.error(error.message || "Failed to create class");
      throw error;
    }
  }

  async updateProdGroup(id: number, data: Partial<ProdGroupFormData>): Promise<ProdGroupApiResponse> {
    try {
      const response = await apiCall.put<ProdGroupApiResponse>(
        `${this.baseUrl}productsubclass`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateProdGroup");

      return response;

    } catch (error: any) {
      console.error(`Error updating class with id ${id}:`, error);
      toast.error(error.message || "Failed to update class");
      throw error;
    }
  }

  async deleteProdGroup(id: number): Promise<ProdGroupApiResponse> {
    try {
      const response = await apiCall.delete<ProdGroupApiResponse>(
        `${this.baseUrl}productsubclass`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error(`Error deleting class with id ${id}:`, error);
      toast.error(error.message || "Failed to delete class");
      throw error;
    }
  }
}

export const prodGroupService = new ProdGroupService();