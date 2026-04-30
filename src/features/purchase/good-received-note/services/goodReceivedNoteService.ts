import { apiCall } from "@/utils/apiClient";
import { GoodReceivedNote, GoodReceivedNoteFormType, GoodReceivedNoteApiResponse, ConfirmGRNApiReponse } from '../types/goodReceivedNote.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

export interface GetGoodReceivedNoteParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class GoodReceivedNoteService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: GoodReceivedNoteApiResponse): boolean {
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

  async getAllGoodReceivedNote(
    params: GetGoodReceivedNoteParams
  ): Promise<GoodReceivedNote[]> {
    try {
      const response = await apiCall.get<GoodReceivedNoteApiResponse>(
        `${this.baseUrl}grn`,
        params
      );

      //  this.handleError(response);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Good Received Notes:", error);
      toast.error(error.message || "Failed to fetch Good Received Notes");
      throw error;
    }
  }

  async getGoodReceivedNoteById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<GoodReceivedNote> {
    try {

      const response = await apiCall.get<GoodReceivedNoteApiResponse>(
        `${this.baseUrl}grn/id`,
        params
      );

      this.handleError(response);

      const data = response.data?.[0];
      if (!data) throw new Error("Good Received Note not found");

      return data;

    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : String(error);

      toast.error(`Error fetching Good Received Note: ${message}`);
      throw new Error(message);
    }
  }

  async createGoodReceivedNote(data: GoodReceivedNoteFormType): Promise<GoodReceivedNoteApiResponse> {
    try {
      const response = await apiCall.post<GoodReceivedNoteApiResponse>(
        `${this.baseUrl}grn`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating Good Received Note:", error);
      toast.error(error.message || "Failed to create Good Received Note");
      throw error;
    }
  }

  async updateGoodReceivedNote(id: number, data: Partial<GoodReceivedNoteFormType>): Promise<GoodReceivedNoteApiResponse> {
    try {
      const response = await apiCall.put<GoodReceivedNoteApiResponse>(
        `${this.baseUrl}grn`,
        { ...data, id },
        { userid: this.getUserId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateGoodReceivedNote");

      return response;

    } catch (error: any) {
      console.error(`Error updating Good Received Note with id ${id}:`, error);
      toast.error(error.message || "Failed to update Good Received Note");
      throw error;
    }
  }

  async deleteGoodReceivedNote(
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

      const response = await apiCall.delete<GoodReceivedNoteApiResponse>(
        `${this.baseUrl}grn`,
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
      console.error(`Error deleting Good Received Note:`, error);
      toast.error(error.message || "Failed to delete Good Received Note");
      throw error;
    }
  }

  async createConfirmGrn(data: GoodReceivedNoteFormType): Promise<ConfirmGRNApiReponse> {
    try {
      const response = await apiCall.put<ConfirmGRNApiReponse>(
        `${this.baseUrl}grn/confirm`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error confirming Good Received Note:", error);
      toast.error(error.message || "Failed to confirm Good Received Note");
      throw error;
    }
  }

}

export const goodReceivedNoteService = new GoodReceivedNoteService();