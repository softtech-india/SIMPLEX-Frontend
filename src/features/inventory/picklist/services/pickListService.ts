import { apiCall } from "@/utils/apiClient";
import { PickList, PickListFormType, PickListApiResponse } from '../types/pickList.types';
import { storageService } from "@/common/utility/storageService";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export interface GetPickListParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class PickListService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private validateResponse(response: PickListApiResponse): PickListApiResponse {
    if (!response) {
      return {
        success: false,
        message: "No response from server",
        data: [],
      };
    }
    return response;
  }


  // SO product list
  async fetchSoProductList(
    { userId, compid, strorder }: { userId: number; compid: number; strorder: string; }
  ) {
    try {
      const response = await apiCall.get<PickListApiResponse>(
        `${this.baseUrl}so/productlist`,
        {
          userId,
          compid,
          strorder, 
        }
      );

      return response.data || [];
    } catch (error: unknown) {
      console.error("Error fetching SO Product list:", error);
      throw new Error(getErrorMessage(error));
    }
  }


  async getAllPickLists(params: GetPickListParams): Promise<PickList[]> {
    try {
      const response = await apiCall.get<PickListApiResponse>(
        `${this.baseUrl}picklist`,
        params
      );

      const handledResponse = this.validateResponse(response);

      return handledResponse.data || [];

    } catch (error: any) {
      console.error("Error fetching Pick Lists:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getPickListById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<PickList> {
    try {

      const response = await apiCall.get<PickListApiResponse>(
        `${this.baseUrl}picklist/id`,
        params
      );
      const handledResponse = this.validateResponse(response);

      if (!handledResponse.success) {
        throw new Error(handledResponse.message || "Failed to fetch entry");
      }

      const PickList = handledResponse.data?.[0];
      if (!PickList) throw new Error("PickList not found");

      return PickList;

    } catch (error: any) {
      console.log(`Error fetching pick list with id ${params.id} : ${error}`);
      throw new Error(getErrorMessage(error));
    }
  }

  async createPickList(data: PickListFormType): Promise<PickListApiResponse> {
    try {
      const response = await apiCall.post<PickListApiResponse>(
        `${this.baseUrl}picklist`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating pick list:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async updatePickList(id: number, data: Partial<PickListFormType>): Promise<PickListApiResponse> {
    try {
      const response = await apiCall.put<PickListApiResponse>(
        `${this.baseUrl}picklist`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return this.validateResponse(response);;

    } catch (error: any) {
      console.error(`Error updating pick list with id ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async deletePickList(
    params: {
      id: number;
      userid: number;
      compid: number;
    }
  ): Promise<PickListApiResponse> {
    try {
      const { id, userid, compid } = params;
      const response = await apiCall.delete<PickListApiResponse>(
        `${this.baseUrl}picklist`,
        {
          id,
          userid,
          compid,
        }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error deleting pick list with id ${params.id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async approvePickList(data: PickListFormType): Promise<PickListApiResponse> {
    try {
      const response = await apiCall.put<PickListApiResponse>(
        `${this.baseUrl}picklist/approve`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating Pick List:", error);
      throw new Error(getErrorMessage(error));
    }
  }


}

export const pickListService = new PickListService();