import { apiCall } from "@/utils/apiClient";
import { Finyear, FinyearFormData, FinyearApiResponse } from '../types/finyear.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class FinyearService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: FinyearApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }

  async getAllFinyear(): Promise<Finyear[]> {
    try {
      const response = await apiCall.get<FinyearApiResponse>(
        `${this.baseUrl}finyear`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching Finyear:", error);
      toast.error(error.message || "Failed to fetch Finyear");
      throw error;
    }
  }

  async getFinyearById(id: number): Promise<Finyear> {
    try {
      const response = await apiCall.get<FinyearApiResponse>(
        `${this.baseUrl}finyear/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const finyear = response.data?.[0];
      if (!finyear) throw new Error("Finyear not found");

      return finyear;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching finyear with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createFinyear(data: FinyearFormData): Promise<FinyearApiResponse> {
    try {
      const response = await apiCall.post<FinyearApiResponse>(
        `${this.baseUrl}finyear`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating finyear:", error);
      toast.error(error.message || "Failed to create finyear");
      throw error;
    }
  }

  async updateFinyear(id: number, data: Partial<FinyearFormData>): Promise<FinyearApiResponse> {
    try {
      const response = await apiCall.put<FinyearApiResponse>(
        `${this.baseUrl}finyear`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateFinyear");

      return response;

    } catch (error: any) {
      console.error(`Error updating finyear with id ${id}:`, error);
      toast.error(error.message || "Failed to update finyear");
      throw error;
    }
  }

  async deleteFinyear(id: number): Promise<void> {
    try {
      const response = await apiCall.delete<FinyearApiResponse>(
        `${this.baseUrl}finyear`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting finyear with id ${id}:`, error);
      toast.error(error.message || "Failed to delete finyear");
      throw error;
    }
  }
}

export const finyearService = new FinyearService();