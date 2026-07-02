import { apiCall } from "@/utils/apiClient";
import { DeliveryChallan, DeliveryChallanApiResponse, DeliveryChallanFormType, DeliveryChallanItem, DeliveryChallanItemApiResponse, } from "../types/deliveryChallan.types";
import { storageService } from "@/common/utility/storageService";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import axios from "axios";

export interface GetDeliveryChallanParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class DeliveryChallanService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private validateResponse(
    response: DeliveryChallanApiResponse
  ): DeliveryChallanApiResponse {
    if (!response) {
      return {
        success: false,
        message: "No response from server",
        data: [],
      };
    }

    return response;
  }


  // SO Picked product list
  async fetchSoPickedProductList({
    userId, compid, orderid,
  }: {
    userId: number; compid: number; orderid: number;
  }): Promise<DeliveryChallanItem[]> {
    const response: DeliveryChallanItemApiResponse = await apiCall.get(`${this.baseUrl}so/pickedproductlist`,
      {
        userId, compid, orderid,
      }
    );

    return response.data ?? [];
  }

  async getAllDeliveryChallans(
    params: GetDeliveryChallanParams
  ): Promise<DeliveryChallan[]> {
    try {
      const response = await apiCall.get<DeliveryChallanApiResponse>(
        `${this.baseUrl}dc`,
        params
      );

      // const handledResponse = this.validateResponse(response);

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching Delivery Challans:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getDeliveryChallanById(params: {
    id: number;
    userid: number;
    compid: number;
    branchid: number | string;
    finid: number;
  }): Promise<DeliveryChallan> {
    try {
      const response = await apiCall.get<DeliveryChallanApiResponse>(
        `${this.baseUrl}dc/id`,
        params
      );

      const handledResponse = this.validateResponse(response);

      if (!handledResponse.success) {
        throw new Error(
          handledResponse.message || "Failed to fetch Delivery Challan"
        );
      }

      const deliveryChallan = handledResponse.data?.[0];

      if (!deliveryChallan) {
        throw new Error("Delivery Challan not found");
      }

      return deliveryChallan;
    } catch (error: any) {
      console.error(
        `Error fetching Delivery Challan with id ${params.id}:`,
        error
      );
      throw new Error(getErrorMessage(error));
    }
  }

  async createDeliveryChallan(
    data: DeliveryChallanFormType
  ): Promise<DeliveryChallanApiResponse> {
    try {
      const response = await apiCall.post<DeliveryChallanApiResponse>(
        `${this.baseUrl}dc`,
        data,
        {
          userid: this.getUserId(),
        }
      );

      return this.validateResponse(response);
    } catch (error: any) {
      console.error("Error creating Delivery Challan:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async updateDeliveryChallan(
    id: number,
    data: Partial<DeliveryChallanFormType>
  ): Promise<DeliveryChallanApiResponse> {
    try {
      const response = await apiCall.put<DeliveryChallanApiResponse>(
        `${this.baseUrl}dc`,
        {
          ...data,
          id,
        },
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
        }
      );

      return this.validateResponse(response);
    } catch (error: any) {
      console.error(
        `Error updating Delivery Challan with id ${id}:`,
        error
      );
      throw new Error(getErrorMessage(error));
    }
  }

  async deleteDeliveryChallan(params: {
    id: number;
    userid: number;
    compid: number;
  }): Promise<DeliveryChallanApiResponse> {
    try {
      const response = await apiCall.delete<DeliveryChallanApiResponse>(
        `${this.baseUrl}dc`,
        params
      );

      return this.validateResponse(response);
    } catch (error: any) {
      console.error(
        `Error deleting Delivery Challan with id ${params.id}:`,
        error
      );
      throw new Error(getErrorMessage(error));
    }
  }

  async getDeliveryChallanPrintById(id: number): Promise<Blob> {
    const token = localStorage.getItem("accessToken") || "";
    try {
      const response = await axios.get(
        `${this.baseUrl}dc/print/pdf`,
        {
          params: {
            userid: this.getUserId(),
            compid: this.getCompanyId(),
            id: id,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error: any) {
      console.error("Error fetching Delivery Challan print:", error);
      throw error;
    }
  }

}

export const deliveryChallanService = new DeliveryChallanService();