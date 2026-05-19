import { apiCall } from "@/utils/apiClient";
import { Company, CompanyFormData, CompanyApiResponse } from '../types/company.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class CompanyService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getUserId = (): string => {
    return storageService.getItem("userId") || "";
  };

  private handleError(response: CompanyApiResponse): boolean {
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

  async getAllCompanies(): Promise<Company[]> {
    try {
      const response = await apiCall.get<CompanyApiResponse>(
        `${this.baseUrl}company`,
        { userid: this.getUserId() }
      );

      //this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching companies:", error);
      //toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getCompanyById(id: number): Promise<Company> {
    try {
      const response = await apiCall.get<CompanyApiResponse>(
        `${this.baseUrl}company/id`,
        { userid: this.getUserId(), id }
      );

      this.handleError(response);

      const company = response.data?.[0];
      if (!company) throw new Error("Company not found");

      return company;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching company with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createCompany(data: CompanyFormData): Promise<CompanyApiResponse> {
    try {
      const response = await apiCall.post<CompanyApiResponse>(
        `${this.baseUrl}company`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(error.message || "Failed to create company");
      throw error;
    }
  }

  async updateCompany(id: number, data: Partial<CompanyFormData>): Promise<CompanyApiResponse> {
    try {
      const response = await apiCall.put<CompanyApiResponse>(
        `${this.baseUrl}company`,
        { ...data, id },
        { userid: this.getUserId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateCompany");

      return response;

    } catch (error: any) {
      console.error(`Error updating company with id ${id}:`, error);
      toast.error(error.message || "Failed to update company");
      throw error;
    }
  }

  async deleteCompany(id: number): Promise<void> {
    try {
      const response = await apiCall.delete<CompanyApiResponse>(
        `${this.baseUrl}company`,
        { userid: this.getUserId(), id }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting company with id ${id}:`, error);
      toast.error(error.message || "Failed to delete company");
      throw error;
    }
  }
}

export const companyService = new CompanyService();