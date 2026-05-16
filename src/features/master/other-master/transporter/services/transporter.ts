import { apiCall } from "@/utils/apiClient";
import {
  Transporter,
  TransporterFormData,
  TransporterApiResponse,
} from "../types/transporter";

import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import useUserStore from "@/store/userStore";
const getUserStore = () => useUserStore.getState();

class TransporterService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: TransporterApiResponse) {
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



  async getAllTransporter(branchId: string | null): Promise<Transporter[]> {
    try {

      const response = await apiCall.get<TransporterApiResponse>(
        `${this.baseUrl}transporter`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching transporter list:", error);
      toast.error(error.message || "Failed to fetch transporter list");
      throw error;
    }
  }

  async getTransporterById(id: number): Promise<Transporter> {
    try {
      const response = await apiCall.get<TransporterApiResponse>(
        `${this.baseUrl}transporter/id`,
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

  async createTransporter(data: TransporterFormData): Promise<TransporterApiResponse> {
    try {
      const response = await apiCall.post<TransporterApiResponse>(
        `${this.baseUrl}transporter`,
        data,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      this.handleError(response);

      return response;
    } catch (error: any) {
      console.error("Error creating transporter:", error);
      toast.error(error.message || "Failed to create transporter");
      throw error;
    }
  }

  async updateTransporter(id: number, data: Partial<TransporterFormData>): Promise<TransporterApiResponse> {
    try {
      const response = await apiCall.put<TransporterApiResponse>(
        `${this.baseUrl}transporter`,
        { ...data, id },
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      this.handleError(response);

      if (!response) {
        throw new Error("Response not found while updating transporter");
      }

      return response;
    } catch (error: any) {
      console.error(`Error updating transporter with id ${id}:`, error);
      toast.error(error.message || "Failed to update transporter");
      throw error;
    }
  }

  async deleteTransporter(id: number): Promise<TransporterApiResponse> {
    try {
      const response = await apiCall.delete<TransporterApiResponse>(
        `${this.baseUrl}transporter`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
          id,
        }
      );

      this.handleError(response);

      return response;
    } catch (error: any) {
      console.error(`Error deleting transporter with id ${id}:`, error);
      toast.error(error.message || "Failed to delete transporter");
      throw error;
    }
  }
}

export const transporterService = new TransporterService();