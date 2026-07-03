import { apiCall } from "@/utils/apiClient";
import axios from "axios";
import { SaleOrder, SaleOrderFormType, SaleOrderApiResponse } from '../types/saleOrder.types';
import { storageService } from "@/common/utility/storageService";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export interface GetSaleOrderParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class SaleOrderService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private validateResponse(response: SaleOrderApiResponse): SaleOrderApiResponse {
    if (!response) {
      return {
        success: false,
        message: "No response from server",
        data: [],
        id: '',
      };
    }
    return response;
  }

  async getAllSaleOrders(
    params: GetSaleOrderParams
  ): Promise<SaleOrder[]> {
    try {
      const response = await apiCall.get<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        params
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Sale orders:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getSaleOrderById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<SaleOrder> {
    try {

      const response = await apiCall.get<SaleOrderApiResponse>(
        `${this.baseUrl}so/id`,
        params
      );

      const handledResponse = this.validateResponse(response);

      if (!handledResponse.success) {
        throw new Error(handledResponse.message || "Failed to fetch entry");
      }

      const SaleOrder = handledResponse.data?.[0];
      if (!SaleOrder) throw new Error("T Bill not found");

      return SaleOrder;

    } catch (error: any) {
      console.log(`Error fetching T Bill list with id ${params.id} : ${error}`);
      throw new Error(getErrorMessage(error));
    }
  }

  async createSaleOrder(data: SaleOrderFormType): Promise<SaleOrderApiResponse> {
    try {
      const response = await apiCall.post<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating SaleOrder:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async updateSaleOrder(id: number, data: Partial<SaleOrderFormType>): Promise<SaleOrderApiResponse> {
    try {
      const response = await apiCall.put<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error updating SaleOrder with id ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async deleteSaleOrder(
    params: {
      id: number;
      userid: number;
      compid: number;
    }
  ): Promise<SaleOrderApiResponse> {
    try {
      const { id, userid, compid } = params;
      const response = await apiCall.delete<SaleOrderApiResponse>(
        `${this.baseUrl}so`,
        {
          id,
          userid,
          compid,
        }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error deleting SaleOrder with id ${params.id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getTbillPrintById(
    id: string | number | undefined, withrate: string
  ): Promise<Blob> {

    if (
      id === undefined ||
      id === null ||
      id === "" ||
      Number(id) === 0
    ) {
      throw new Error("Sale ID must be greater than 0.");
    }


    const token = localStorage.getItem("accessToken") || "";
    try {
      const response = await axios.get(
        `${this.baseUrl}so/print/pdf`,
        {
          params: {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            id: id,
            withrate: withrate,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      console.error("Error fetching Sale Order print:", error);

      // Handle backend validation/error response
      if (error.response) {
        if (error.response.data instanceof Blob) {
          try {
            const text = await error.response.data.text();
            const json = JSON.parse(text);

            throw new Error(
              json.message ||
              json.error ||
              "Failed to generate Sale Order PDF."
            );
          } catch {
            throw new Error("Failed to generate Sale Order PDF.");
          }
        }

        throw new Error(
          error.response.data?.message || "Failed to generate Sale Order PDF."
        );
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async approveSaleOrder(data: SaleOrderFormType): Promise<SaleOrderApiResponse> {
    try {
      const response = await apiCall.put<SaleOrderApiResponse>(
        `${this.baseUrl}so/approve`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating Sale Order:", error);
      throw new Error(getErrorMessage(error));
    }
  }



}

export const saleOrderService = new SaleOrderService();