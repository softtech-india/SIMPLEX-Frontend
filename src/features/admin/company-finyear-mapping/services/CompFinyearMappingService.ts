import { apiCall } from "@/utils/apiClient";
import { CompFinyearMappingState, CompFinyearMappingApiResponse, Company, CompanyApiResponse } from '../types/compFinyearMapping.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class CompFinyearMapping {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");

  private handleError(response: CompFinyearMappingApiResponse): boolean {
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

  async getAllCompany(): Promise<Company[]> {
    try {
      const response = await apiCall.get<CompanyApiResponse>(
        `${this.baseUrl}company`,
        {
          userid: this.getUserId()
        }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching company list:", error);
      toast.error(error.message || "Failed to fetch company list");
      throw error;
    }
  }

  async getAllMapUnmappData(companyId: number): Promise<CompFinyearMappingState> {
    try {
      const response = await apiCall.get<CompFinyearMappingApiResponse>(
        `${this.baseUrl}compfinyearmapping`,
        {
          userid: this.getUserId(),
          compid: Number(companyId),
        }
      );

     // this.handleError(response);

      return {
        mapped: response.mapped || [],
        unMapped: response.unMapped || []
      };

    } catch (error: any) {
      console.error("Error fetching mapping data:", error);
      toast.error(error.message || "Failed to fetch mapping data");
      throw error;
    }
  }

  async createCompFinyearMapping(companyId: number, finid: number): Promise<CompFinyearMappingState> {
    try {

      const response = await apiCall.post<CompFinyearMappingApiResponse>(
        `${this.baseUrl}compfinyearmapping`,
        null,
        {
          userid: Number(this.getUserId()),
          compid: Number(companyId),
          finid: Number(finid),
        }
      );

      this.handleError(response);

      // return {
      //   mapped: response.mapped || [],
      //   unMapped: response.unMapped || []
      // };

      return response;

    } catch (error: any) {
      console.error("Error creating mapping:", error);
      toast.error(error.message || "Failed to create mapping");

      throw error;
    }
  }




}

export const compFinyearMapping = new CompFinyearMapping();