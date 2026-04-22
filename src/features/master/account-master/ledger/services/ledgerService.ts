import { apiCall } from "@/utils/apiClient";
import { Ledger, LedgerFormType, LedgerApiResponse, LedgerAPI } from '../types/ledger.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class LedgerService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: LedgerApiResponse): boolean {
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

  async getAllLedgers(): Promise<LedgerAPI[]> {
    try {
      const response = await apiCall.get<LedgerApiResponse>(
        `${this.baseUrl}ledger`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching companies:", error);
      toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getLedgerById(id: number): Promise<LedgerAPI> {
    try {
      const response = await apiCall.get<LedgerApiResponse>(
        `${this.baseUrl}ledger/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const Ledger = response.data?.[0];
      if (!Ledger) throw new Error("Ledger not found");

      return Ledger;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching Ledger with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createLedger(data: LedgerFormType): Promise<LedgerApiResponse> {
    try {
      const response = await apiCall.post<LedgerApiResponse>(
        `${this.baseUrl}ledger`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Ledger:", error);
      toast.error(error.message || "Failed to create Ledger");
      throw error;
    }
  }

  async updateLedger(id: number, data: Partial<LedgerFormType>): Promise<LedgerApiResponse> {
    try {
      const response = await apiCall.put<LedgerApiResponse>(
        `${this.baseUrl}ledger`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateLedger");

      return response;

    } catch (error: any) {
      console.error(`Error updating Ledger with id ${id}:`, error);
      toast.error(error.message || "Failed to update Ledger");
      throw error;
    }
  }

  async deleteLedger(id: number): Promise<void> {
    try {
      const response = await apiCall.delete<LedgerApiResponse>(
        `${this.baseUrl}ledger`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting Ledger with id ${id}:`, error);
      toast.error(error.message || "Failed to delete Ledger");
      throw error;
    }
  }
}

export const ledgerService = new LedgerService();