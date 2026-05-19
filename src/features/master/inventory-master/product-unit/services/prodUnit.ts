import { apiCall } from "@/utils/apiClient";
import { ProdUnit, ProdUnitFormData, ProdUnitApiResponse, GstUnitApiResponse, GstUnit } from '../types/prodUnit.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class ProdUnitService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: ProdUnitApiResponse): boolean {
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


  async getAllProdUnits(): Promise<ProdUnit[]> {
    try {
      const response = await apiCall.get<ProdUnitApiResponse>(
        `${this.baseUrl}unit`,
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

  async getAllGstUnits(): Promise<GstUnit[]> {
    try {
      const response = await apiCall.get<GstUnitApiResponse>(
        `${this.baseUrl}gstunit`,
        { userid: this.getUserId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching companies:", error);
      toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getProdUnitById(id: number): Promise<ProdUnit> {
    try {
      const response = await apiCall.get<ProdUnitApiResponse>(
        `${this.baseUrl}unit/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const unit = response.data?.[0];
      if (!unit) throw new Error("ProdUnit not found");

      return unit;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching unit with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createProdUnit(data: ProdUnitFormData): Promise<ProdUnitApiResponse> {
    try {
      const response = await apiCall.post<ProdUnitApiResponse>(
        `${this.baseUrl}unit`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating unit:", error);
      toast.error(error.message || "Failed to create unit");
      throw error;
    }
  }

  async updateProdUnit(id: number, data: Partial<ProdUnitFormData>): Promise<ProdUnitApiResponse> {
    try {
      const response = await apiCall.put<ProdUnitApiResponse>(
        `${this.baseUrl}unit`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateProdUnit");

      return response;

    } catch (error: any) {
      console.error(`Error updating unit with id ${id}:`, error);
      toast.error(error.message || "Failed to update unit");
      throw error;
    }
  }

  async deleteProdUnit(id: number): Promise<ProdUnitApiResponse> {
    try {
      const response = await apiCall.delete<ProdUnitApiResponse>(
        `${this.baseUrl}unit`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error(`Error deleting unit with id ${id}:`, error);
      toast.error(error.message || "Failed to delete unit");
      throw error;
    }
  }
}

export const prodUnitService = new ProdUnitService();