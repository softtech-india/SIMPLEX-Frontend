import { apiCall } from "@/utils/apiClient";
import { GRNParams, GRN, GRNApiResponse, Vendor, VendorApiResponse } from '../types/grnRegister.type';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class GRNService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  async getAllGRNs(params: GRNParams): Promise<GRN[]> {
    try {
      const response = await apiCall.get<GRNApiResponse>(
        `${this.baseUrl}grnreg`,
        params
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching GRNs:", error);
      toast.error(error.message || "Failed to fetch GRNs");
      throw error;
    }
  }

  async getAllBrands(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}category`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      return [];
    }
  }

  async getAllClasses(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}class`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      return [];
    }
  }

  async getAllVendors(userid: number, compid: number): Promise<Vendor[]> {
    try {
      const response = await apiCall.get<VendorApiResponse>(
        `${this.baseUrl}vendor`,
        { userid, compid, skip: 0, take: 10000 }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      toast.error(error.message || "Failed to fetch vendors");
      throw error;
    }
  }

  async getAllStates(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}state`,
        { userid: this.getUserId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching states:", error);
      return [];
    }
  }
}

export const grnService = new GRNService();