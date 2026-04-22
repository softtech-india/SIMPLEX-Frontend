import { apiCall } from "@/utils/apiClient";
import { HSN, HSNFormData, HSNApiResponse, GST, GSTApiResponse } from '../types/hsn.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class HSNService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: HSNApiResponse | HSNApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }




  async getAllHSNs(): Promise<HSN[]> {
    try {
      const response = await apiCall.get<HSNApiResponse>(
        `${this.baseUrl}hsn`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All HSN:", error);
      toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getAllGSTs(): Promise<GST[]> {
    try {

      const response: any = await apiCall.get<GSTApiResponse>(
        `${this.baseUrl}gst`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching GSTs:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getProdHSNById(id: number): Promise<HSN> {
    try {
      const response = await apiCall.get<HSNApiResponse>(
        `${this.baseUrl}hsn/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const hsn = response.data?.[0];
      if (!hsn) throw new Error("HSN not found");

      return hsn;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching HSN with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createHSN(data: HSNFormData): Promise<HSNApiResponse> {
    try {
      const response = await apiCall.post<HSNApiResponse>(
        `${this.baseUrl}hsn`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating hsn:", error);
      toast.error(error.message || "Failed to create hsn");
      throw error;
    }
  }

  async updateHSN(id: number, data: Partial<HSNFormData>): Promise<HSNApiResponse> {
    try {
      const response = await apiCall.put<HSNApiResponse>(
        `${this.baseUrl}hsn`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update hsn");

      return response;

    } catch (error: any) {
      console.error(`Error updating hsn with id ${id}:`, error);
      toast.error(error.message || "Failed to update hsn");
      throw error;
    }
  }

  async deleteHSN(id: number): Promise<HSNApiResponse> {
    try {
      const response = await apiCall.delete<HSNApiResponse>(
        `${this.baseUrl}hsn`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error(`Error deleting hsn with id ${id}:`, error);
      toast.error(error.message || "Failed to delete hsn");
      throw error;
    }
  }
}

export const hSNService = new HSNService();