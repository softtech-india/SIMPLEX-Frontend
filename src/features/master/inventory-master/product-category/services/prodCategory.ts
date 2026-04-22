import { apiCall } from "@/utils/apiClient";
import { ProdCategory, ProdCategoryFormData, ProdCategoryApiResponse } from '../types/prodCategory.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class ProdCategoryService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: ProdCategoryApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }

  async getAllProdCategories(): Promise<ProdCategory[]> {
    try {
      const response = await apiCall.get<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
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

  async getProdCategoryById(id: number): Promise<ProdCategory> {
    try {
      const response = await apiCall.get<ProdCategoryApiResponse>(
        `${this.baseUrl}category/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const category = response.data?.[0];
      if (!category) throw new Error("ProdCategory not found");

      return category;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching category with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createProdCategory(data: ProdCategoryFormData): Promise<ProdCategoryApiResponse> {
    try {
      const response = await apiCall.post<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(error.message || "Failed to create category");
      throw error;
    }
  }

  async updateProdCategory(id: number, data: Partial<ProdCategoryFormData>): Promise<ProdCategoryApiResponse> {
    try {
      const response = await apiCall.put<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateProdCategory");

      return response;

    } catch (error: any) {
      console.error(`Error updating category with id ${id}:`, error);
      toast.error(error.message || "Failed to update category");
      throw error;
    }
  }

  async deleteProdCategory(id: number): Promise<ProdCategoryApiResponse> {
    try {
      const response = await apiCall.delete<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response); // ✅ run before return

      return response; // ✅ return full response

    } catch (error: any) {
      console.error(`Error deleting category with id ${id}:`, error);
      toast.error(error.message || "Failed to delete category");
      throw error;
    }
  }
}

export const prodCategoryService = new ProdCategoryService();