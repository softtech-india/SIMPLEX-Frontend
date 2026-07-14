import { apiCall } from "@/utils/apiClient";
import { Requisition, RequisitionFormType, RequisitionApiResponse } from '../types/requisition.types';
import { storageService } from "@/common/utility/storageService";
import axios from "axios";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export interface GetRequisitionParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

class RequisitionService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private validateResponse(response: RequisitionApiResponse): RequisitionApiResponse {
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

  async getAllGodowns(branchId: number): Promise<any[]> {
    try {
      const response = await apiCall.get<any[]>(
        `${this.baseUrl}godown`,
        { userid: this.getUserId(), compid: this.getCompanyId(), branchid: branchId }
      );
      return response || [];
    } catch (error: any) {
      console.error("Error fetching godown:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getAllBranches(): Promise<any[]> {
    try {
      const response = await apiCall.get<any[]>(
        `${this.baseUrl}branch`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response || [];
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getAllRequisitions(params: GetRequisitionParams): Promise<Requisition[]> {
    try {
      const response = await apiCall.get<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
        params
      );

      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching purchase orders:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async getRequisitionById(
    params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number
    }
  ): Promise<Requisition> {
    try {

      const response = await apiCall.get<RequisitionApiResponse>(
        `${this.baseUrl}requisition/id`,
        params
      );

      const handledResponse = this.validateResponse(response);

      if (!handledResponse.success) {
        throw new Error(
          handledResponse.message || "Failed to fetch requisition"
        );
      }

      const requisition = handledResponse.data?.[0];

      if (!requisition) {
        throw new Error("requisition not found");
      }

      return requisition;

    } catch (error: any) {
      console.error(`Error fetching requisition with id ${params.id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  }

  async createRequisition(data: RequisitionFormType): Promise<RequisitionApiResponse> {
    try {
      const response = await apiCall.post<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
        data,
        { userid: this.getUserId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error("Error creating requisition:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  async updateRequisition(id: number, data: Partial<RequisitionFormType>): Promise<RequisitionApiResponse> {
    try {
      const response = await apiCall.put<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return this.validateResponse(response);

    } catch (error: any) {
      console.error(`Error updating requisition with id ${id}:`, error);
      throw new Error(getErrorMessage(error));;
    }
  }

  // async deleteRequisition(id: number): Promise<RequisitionApiResponse> {
  //   try {
  //     const response = await apiCall.delete<RequisitionApiResponse>(
  //       `${this.baseUrl}requisition`,
  //       { userid: this.getUserId(), compid: this.getCompanyId(), id }
  //     );

  //     return this.validateResponse(response);

  //   } catch (error: any) {
  //     console.error(`Error deleting requisition with id ${id}:`, error);
  //     throw new Error(getErrorMessage(error));
  //   }
  // }

  async deleteRequisition(params: {
    id: number;
  }): Promise<RequisitionApiResponse> {
    try {
      const response = await apiCall.delete<RequisitionApiResponse>(
        `${this.baseUrl}requisition`,
        params
      );

      return this.validateResponse(response);
    } catch (error: any) {
      console.error(
        `Error deleting requisition with id ${params.id}:`,
        error
      );
      throw new Error(getErrorMessage(error));
    }
  }

  async getRequisitionPrintById(id: string | number ): Promise<Blob> {
    const token = localStorage.getItem("accessToken") || "";
    try {

      if (
        id === undefined ||
        id === null ||
        Number(id) === 0
      ) {
        throw new Error("Sale Order ID must be greater than 0.");
      }
      const response = await axios.get(
        `${this.baseUrl}requisition/print/pdf`,
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
      console.error("Error fetching requisition print:", error);
      throw new Error(getErrorMessage(error));
    }
  }


}

export const requisitionService = new RequisitionService();