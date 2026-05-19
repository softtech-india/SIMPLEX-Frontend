import { apiCall } from "@/utils/apiClient";
import { OpeningStock, OpeningStockFormType, OpeningStockApiResponse } from '../types/openingStock.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

export interface GetOpeningStockParams {
  userid: number;
  compid: number;
  branchid?: number;
  finid?: number;
}

class OpeningStockService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: OpeningStockApiResponse): boolean {
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

  async getAllProducts(
    params: GetOpeningStockParams
  ): Promise<OpeningStock[]> {
    try {
      const response = await apiCall.get<OpeningStockApiResponse>(
        `${this.baseUrl}product`,
        params
      );

      //this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching opening stock:", error);
      //toast.error(error.message || "Failed to fetch opening stock");
      throw error;
    }
  }

  async getAllOpeningStocks(
    params: GetOpeningStockParams
  ): Promise<OpeningStock[]> {
    try {
      const response = await apiCall.get<OpeningStockApiResponse>(
        `${this.baseUrl}opstock`,
        params
      );

      //this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching opening stock:", error);
      toast.error(error.message || "Failed to fetch opening stock");
      throw error;
    }
  }

  async getOpeningStockById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<OpeningStock> {
    try {

      const response = await apiCall.get<OpeningStockApiResponse>(
        `${this.baseUrl}opstock/id`,
        params
      );

      this.handleError(response);

      const openingStock = response.data?.[0];
      if (!openingStock) throw new Error("Opening stock not found");

      return openingStock;

    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : String(error);

      toast.error(`Error fetching opening stock: ${message}`);
      throw new Error(message);
    }
  }

  async createOpeningStock(data: OpeningStockFormType): Promise<OpeningStockApiResponse> {
    try {
      const response = await apiCall.post<OpeningStockApiResponse>(
        `${this.baseUrl}opstock`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating opening stock:", error);
      toast.error(error.message || "Failed to create createOpeningStock");
      throw error;
    }
  }

  async updateOpeningStock(id: number, data: Partial<OpeningStockFormType>): Promise<OpeningStockApiResponse> {
    try {
      const response = await apiCall.put<OpeningStockApiResponse>(
        `${this.baseUrl}opstock`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateOpeningStock");

      return response;

    } catch (error: any) {
      console.error(`Error updating updateOpeningStock with id ${id}:`, error);
      toast.error(error.message || "Failed to update opening stock");
      throw error;
    }
  }

  //   async deleteOpeningStock(id: number): Promise<void> {
  //     try {
  //       const response = await apiCall.delete<OpeningStockApiResponse>(
  //         `${this.baseUrl}opstock`,
  //         { userid: this.getUserId(), compid: this.getCompanyId(), id }
  //       );

  //       this.handleError(response);

  //     } catch (error: any) {
  //       console.error(`Error deleting deleteOpeningStock with id ${id}:`, error);
  //       toast.error(error.message || "Failed to delete deleteOpeningStock");
  //       throw error;
  //     }
  //   }

  async deleteOpeningStock(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<void> {
    try {
      const { id, userid, compid, branchid, finid } = params;
      const response = await apiCall.delete<OpeningStockApiResponse>(
        `${this.baseUrl}opstock`,
        {
          id,
          userid,
          compid,
          branchid,
          finid,
        }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting deleteOpening Stock:`, error);
      toast.error(error.message || "Failed to delete deleteOpening Stock");
      throw error;
    }
  }

}

export const openingStockService = new OpeningStockService();