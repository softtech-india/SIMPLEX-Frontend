import { apiCall } from "@/utils/apiClient";
import { StockTrial, stockTrialApiResponse, BrandApiResponse, Brand, StockLedgerTransaction, stockLedgerApiResponse } from '../types/stockTrial.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import { StockTrialParams } from "../types/stockTrial.types";



class StockTrialService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: stockTrialApiResponse | BrandApiResponse): boolean {
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



  async getAllBrands(
  ): Promise<Brand[]> {
    try {
      const response = await apiCall.get<BrandApiResponse>(
        `${this.baseUrl}category`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      //   this.handleError(response);
      console.log(123)
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching brands orders:", error);
      toast.error(error.message || "Failed to fetch brands orders");
      throw error;
    }
  }
  async getAllClasses(
  ): Promise<Brand[]> {
    try {
      const response = await apiCall.get<BrandApiResponse>(
        `${this.baseUrl}class`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      //   this.handleError(response);
      console.log(123)
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching brands orders:", error);
      toast.error(error.message || "Failed to fetch brands orders");
      throw error;
    }
  }
  async getAllSubClasses(
  ): Promise<Brand[]> {
    try {
      const response = await apiCall.get<BrandApiResponse>(
        `${this.baseUrl}productsubclass`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      //   this.handleError(response);
      console.log(123)
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching subclasses orders:", error);
      toast.error(error.message || "Failed to fetch subclasses orders");
      throw error;
    }
  }
  async getAllGodown(branchid?: number | string): Promise<Brand[]> {
    try {
      const response = await apiCall.get<BrandApiResponse>(
        `${this.baseUrl}godown`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
          branchid: branchid, // 👈 add this
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching godown:", error);
      toast.error(error.message || "Failed to fetch godown");
      throw error;
    }
  }


  async getAllStockTrials(
    params: StockTrialParams
  ): Promise<StockTrial[]> {
    try {
      const response = await apiCall.get<stockTrialApiResponse>(
        `${this.baseUrl}stocktrial`,
        params
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching stock trial orders:", error);
      toast.error(error.message || "Failed to fetch stock trial orders");
      throw error;
    }
  }


  async getAllStockLedgers(
    params: {
      userid: number;
      compid: number;
      branchid: number;
      finid: number;
      startdt: string;
      enddt: string;
      productid: number;
      strgodown: string;
    }
  ): Promise<StockLedgerTransaction[]> {
    try {
      const response = await apiCall.get<stockLedgerApiResponse>(
        `${this.baseUrl}stockledger`,
        params
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching stock ledger:", error);
      toast.error(error.message || "Failed to fetch stock ledger");
      throw error;
    }
  }
}

export const stockTrialService = new StockTrialService();