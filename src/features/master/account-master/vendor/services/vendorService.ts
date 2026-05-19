import { apiCall } from "@/utils/apiClient";
import { Vendor, VendorFormData, VendorApiResponse, CorpGroup, CorpGroupApiResponse, SubLedgerType, SubLedgerApiResponse, TDS, TDSApiResponse } from '../types/vendor.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class VendorService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: VendorApiResponse | CorpGroupApiResponse | SubLedgerApiResponse): boolean {
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

  async getAllCorpGroups(): Promise<CorpGroup[]> {
    try {
      const response = await apiCall.get<CorpGroupApiResponse>(
        `${this.baseUrl}corpgroup`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      //this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      //toast.error(error.message || "Failed to fetch Vendors");
      throw error;
    }
  }
  async getAllSubLedgers(): Promise<SubLedgerType[]> {
    try {
      const response = await apiCall.get<SubLedgerApiResponse>(
        `${this.baseUrl}subledgertype`,
        { userid: this.getUserId(), compid: this.getCompanyId(), nature: "VE" }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      toast.error(error.message || "Failed to fetch Vendors");
      throw error;
    }
  }
  async getAlltdsSections(): Promise<TDS[]> {
    try {
      const response = await apiCall.get<TDSApiResponse>(
        `${this.baseUrl}tdssection`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      toast.error(error.message || "Failed to fetch Vendors");
      throw error;
    }
  }
  async getAllVendors(): Promise<Vendor[]> {
    try {
      const response = await apiCall.get<VendorApiResponse>(
        `${this.baseUrl}vendor`,
        { userid: this.getUserId(), compid: this.getCompanyId(), skip: 0, take: 10000 }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      toast.error(error.message || "Failed to fetch Vendors");
      throw error;
    }
  }

  async getVendorById(id: number): Promise<Vendor> {
    try {
      const response = await apiCall.get<VendorApiResponse>(
        `${this.baseUrl}vendor/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const Vendor = response.data?.[0];
      if (!Vendor) throw new Error("Vendor not found");

      return Vendor;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching Vendor with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createVendor(data: VendorFormData): Promise<VendorApiResponse> {
    try {
      const response = await apiCall.post<VendorApiResponse>(
        `${this.baseUrl}vendor`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Vendor:", error);
      toast.error(error.message || "Failed to create Vendor");
      throw error;
    }
  }

  async updateVendor(id: number, data: Partial<VendorFormData>): Promise<VendorApiResponse> {
    try {
      const response = await apiCall.put<VendorApiResponse>(
        `${this.baseUrl}vendor`,
        { ...data, id },
        { userId: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateVendor");
      console.log(response)
      return response;

    } catch (error: any) {
      console.error(`Error updating Vendor with id ${id}:`, error);
      toast.error(error.message || "Failed to update Vendor");
      throw error;
    }
  }

  async deleteVendor(id: number): Promise<VendorApiResponse> {
    try {
      const response = await apiCall.delete<VendorApiResponse>(
        `${this.baseUrl}vendor`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);
      return response;

    } catch (error: any) {
      console.error(`Error deleting Vendor with id ${id}:`, error);
      toast.error(error.message || "Failed to delete Vendor");
      throw error;
    }
  }
}

export const vendorService = new VendorService();