import { apiCall } from "@/utils/apiClient";
import axios from "axios";
import { DirectSale, DirectSaleFormType, DirectSaleApiResponse } from '../types/directSale.types';
import { storageService } from "@/common/utility/storageService";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export interface GetDirectSaleParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class DirectSaleService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private validateResponse(response: DirectSaleApiResponse): DirectSaleApiResponse {
    if (!response) {
      return {
        success: false,
        message: "No response from server",
        data: [],
        id: 0,
      };
    }
    return response;
  }


  async getAllDirectSales(
    params: GetDirectSaleParams
  ): Promise<DirectSale[]> {
    try {
      const response = await apiCall.get<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        params
      );

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Direct Sales:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getDirectSaleById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<DirectSale> {
    try {

      const response = await apiCall.get<DirectSaleApiResponse>(
        `${this.baseUrl}sale/id`,
        params
      );

      const handledResponse = this.validateResponse(response);

      if (!handledResponse.success) {
        throw new Error(handledResponse.message || "Failed to fetch entry");
      }

      const DirectSale = handledResponse.data?.[0];
      if (!DirectSale) throw new Error("DirectSale not found");

      return DirectSale;

    } catch (error: any) {
      console.log(`Error fetching sale list with id ${params.id} : ${error}`);
      throw new Error(getErrorMessage(error));
    }
  }

  async createDirectSale(data: DirectSaleFormType): Promise<DirectSaleApiResponse> {
    try {
      const response = await apiCall.post<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating Direct Sale:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async updateDirectSale(id: number, data: Partial<DirectSaleFormType>): Promise<DirectSaleApiResponse> {
    try {
      const response = await apiCall.put<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error updating Direct Sale with id ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async deleteDirectSale(
    params: {
      userid: number;
      compid: number;
      id: number;
    }
  ): Promise<DirectSaleApiResponse> {
    try {
      const { id, userid, compid } = params;

      const response = await apiCall.delete<DirectSaleApiResponse>(
        `${this.baseUrl}sale`,
        { userid, compid, id, }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error deleting Direct Sale with id ${params.id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async approveDirectSale(data: DirectSaleFormType): Promise<DirectSaleApiResponse> {
    try {
      const response = await apiCall.put<DirectSaleApiResponse>(
        `${this.baseUrl}sale/approve`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating Direct Sale:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getSaleBillPrintById(
    id: string | number | undefined,
    withRate: string
  ): Promise<Blob> {
    const token = localStorage.getItem("accessToken") || "";
    try {

      if (
        id === undefined ||
        id === null ||
        id === "" ||
        Number(id) === 0
      ) {
        throw new Error("Sale ID must be greater than 0.");
      }


      const response = await axios.get(
        `${this.baseUrl}sale/print/pdf`,
        {
          params: {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            billid: id,
            withRate: withRate,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  }


}

export const directSaleService = new DirectSaleService();