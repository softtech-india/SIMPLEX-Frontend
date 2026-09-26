import { apiCall } from "@/utils/apiClient";
import { ProdCategory, ProdCategoryFormData, ProdCategoryApiResponse } from '../types/prodCategory.types';
import { storageService } from "@/common/utility/storageService";
import { getErrorMessage } from "@/helpers/getErrorMessage";

class ProdCategoryService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private validateResponse(response: ProdCategoryApiResponse): ProdCategoryApiResponse {

    if (!response) {
      return {
        success: false,
        message: "No response from server",
        data: [],
      };
    }

    return response;
  }

  async getAllProdCategories(): Promise<ProdCategory[]> {
    try {
      const response = await apiCall.get<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching companies:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getProdCategoryById(id: number): Promise<ProdCategory> {
    try {
      const response = await apiCall.get<ProdCategoryApiResponse>(
        `${this.baseUrl}category/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.validateResponse(response);

      const handledResponse = this.validateResponse(response);

      if (!handledResponse.success) {
        throw new Error(handledResponse.message || "Failed to fetch entry");
      }

      const category = handledResponse.data?.[0];

      if (!category) {
        throw new Error("Product Category not found");
      }

      return category;

    } catch (error: any) {
      console.error("Error fetching Product Category by id:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async createProdCategory(data: ProdCategoryFormData): Promise<ProdCategoryApiResponse> {
    try {
      const response = await apiCall.post<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response;

    } catch (error: any) {
      console.error("Error creating category:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async updateProdCategory(id: number, data: Partial<ProdCategoryFormData>): Promise<ProdCategoryApiResponse> {
    try {
      const response = await apiCall.put<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error updating category with id ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async deleteProdCategory(params: {
    id: number;
    userid: number;
    compid: number;
  }): Promise<ProdCategoryApiResponse> {
    try {
      const { id, userid, compid, } = params;
      const response = await apiCall.delete<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        { id, userid, compid }
      );
      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error deleting IMR entry with id ${params.id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }
}

export const prodCategoryService = new ProdCategoryService();