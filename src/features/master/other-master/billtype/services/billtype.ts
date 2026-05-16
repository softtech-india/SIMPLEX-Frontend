import { apiCall } from "@/utils/apiClient";
import { BillType, BillTypeFormData, BillTypeApiResponse } from '../types/billtype.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class BillTypeService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };


  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: BillTypeApiResponse): boolean {
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


  async getAllBillTypes(): Promise<BillType[]> {
    try {
      const response = await apiCall.get<BillTypeApiResponse>(
        `${this.baseUrl}billtype`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All Bill type:", error);
      toast.error(error.message || "Failed to fetch Bill type");
      throw error;
    }
  }

  async getAllLedgers(grouptype: string): Promise<BillType[]> {
    try {
      const response = await apiCall.get<BillTypeApiResponse>(
        `${this.baseUrl}ledger`,
        { userid: this.getUserId(), compid: this.getCompanyId(), grouptype: grouptype }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error(`Error fetching All ledger with group type ${grouptype}:`, error);
      toast.error(error.message || "Failed to fetch ledger");
      throw error;
    }
  }

  async getProdBillTypeById(id: number): Promise<BillType> {
    try {
      const response = await apiCall.get<BillTypeApiResponse>(
        `${this.baseUrl}billtype/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const billtype = response.data?.[0];
      if (!billtype) throw new Error("Bill Type not found");

      return billtype;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching bill type with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createBillType(data: BillTypeFormData): Promise<BillTypeApiResponse> {
    try {
      const response = await apiCall.post<BillTypeApiResponse>(
        `${this.baseUrl}billtype`,
        data
        ,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Bill type:", error);
      toast.error(error.message || "Failed to create Bill type");
      throw error;
    }
  }

  async updateBillType(id: number, data: Partial<BillTypeFormData>): Promise<BillTypeApiResponse> {
    try {
      const response = await apiCall.put<BillTypeApiResponse>(
        `${this.baseUrl}billtype`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update Bill type");

      return response;

    } catch (error: any) {
      console.error(`Error updating Bill type with id ${id}:`, error);
      toast.error(error.message || "Failed to update Bill type");
      throw error;
    }
  }

  async deleteBillType(id: number): Promise<BillTypeApiResponse> {
    try {
      const response = await apiCall.delete<BillTypeApiResponse>(
        `${this.baseUrl}billtype`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error(`Error deleting Bill type with id ${id}:`, error);
      toast.error(error.message || "Failed to delete Bill type");
      throw error;
    }
  }
}

export const billTypeService = new BillTypeService();