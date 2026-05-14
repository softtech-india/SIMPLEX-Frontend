import { apiCall } from "@/utils/apiClient";
import { SaleRegisterParams, SaleRegister, SaleRegisterApiResponse } from '../types/saleRegister.type';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";



class SaleRegisterService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: SaleRegisterApiResponse): boolean {
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


  async getAllBranches(
  ): Promise<SaleRegister[]> {
    try {
      const response = await apiCall.get<SaleRegisterApiResponse>(
        `${this.baseUrl}branch`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching sale register:", error);
      toast.error(error.message || "Failed to fetch sale register");
      throw error;
    }
  }
  async getAllStates(
  ): Promise<SaleRegister[]> {
    try {
      const response = await apiCall.get<SaleRegisterApiResponse>(
        `${this.baseUrl}state`,
        { userid: this.getUserId() }
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching sale register:", error);
      toast.error(error.message || "Failed to fetch sale register");
      throw error;
    }
  }

  async getAllSaleRegisters(
    params: SaleRegisterParams
  ): Promise<SaleRegister[]> {
    try {
      const response = await apiCall.get<SaleRegisterApiResponse>(
        `${this.baseUrl}salereg`,
        params
      );

      //   this.handleError(response);
      return response.data || [];
    } catch (error: any) {
     // console.error("Error fetching sale register:", error);
     // toast.error(error.message || "Failed to fetch sale register");
      throw error;
    }
  }


  async getAllSaleRegistersWithProd(
    params: SaleRegisterParams
  ): Promise<SaleRegister[]> {
    try {
      const response = await apiCall.get<SaleRegisterApiResponse>(
        `${this.baseUrl}salereg/withprod`,
        params
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Sale register with products:", error);
      toast.error(error.message || "Failed to fetch Sale register with products");
      throw error;
    }
  }


}

export const saleRegisterService = new SaleRegisterService();