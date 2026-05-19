import { apiCall } from "@/utils/apiClient";
import { VoucherNumbering, VoucherNumberingFormData, VoucherNumberingApiResponse, VoucherApiResponse, Voucher } from '../types/vouchernumbering.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import useUserStore from "@/store/userStore";

const getUserStore = () => useUserStore.getState();

class VoucherNumberingService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };


  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: VoucherNumberingApiResponse | VoucherApiResponse) {
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


  async getAllVouchers(): Promise<Voucher[]> {
    try {
      const response = await apiCall.get<VoucherApiResponse>(
        `${this.baseUrl}voucher`,
        { userid: this.getUserId() }
      );

      //this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All Voucher:", error);
      //toast.error(error.message || "Failed to fetch Voucher");
      throw error;
    }
  }

  async getAllVoucherNumberings(): Promise<VoucherNumbering[]> {
    try {
      const { branchId, finid } = getUserStore();

      const response = await apiCall.get<VoucherNumberingApiResponse>(
        `${this.baseUrl}vouchernumbering`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
          branchid: branchId,
          finid: finid
        }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All VoucherNumbering:", error);
      toast.error(error.message || "Failed to fetch VoucherNumbering");
      throw error;
    }
  }
  async getProdVoucherNumberingId(id: number): Promise<VoucherNumbering> {
    try {
      const response = await apiCall.get<VoucherNumberingApiResponse>(
        `${this.baseUrl}vouchernumbering/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const godown = response.data?.[0];
      if (!godown) throw new Error("VoucherNumbering not found");

      return godown;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching VoucherNumbering with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createVoucherNumbering(data: VoucherNumbering): Promise<VoucherNumberingApiResponse> {
    try {
      const { branchId, finid } = getUserStore();

      const response = await apiCall.post<VoucherNumberingApiResponse>(
        `${this.baseUrl}vouchernumbering`,
        {
          ...data,
          branchid: branchId,
          finid: finid
        }
        ,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Godown:", error);
      toast.error(error.message || "Failed to create Godown");
      throw error;
    }
  }

  async updateVoucherNumbering(id: number, data: Partial<VoucherNumbering>): Promise<VoucherNumberingApiResponse> {
    try {
      const response = await apiCall.put<VoucherNumberingApiResponse>(
        `${this.baseUrl}vouchernumbering`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update godown");

      return response;

    } catch (error: any) {
      console.error(`Error updating godown with id ${id}:`, error);
      toast.error(error.message || "Failed to update godown");
      throw error;
    }
  }

  async deleteVoucherNumbering(id: number): Promise<VoucherNumberingApiResponse> {
    try {
      const response = await apiCall.delete<VoucherNumberingApiResponse>(
        `${this.baseUrl}vouchernumbering`,
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

export const vouchernumberingService = new VoucherNumberingService();