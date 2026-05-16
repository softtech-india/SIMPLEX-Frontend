import { apiCall } from "@/utils/apiClient";
import { ProdClass, ProdClassFormData, ProdClassApiResponse } from '../types/prodClass.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class ProdClassService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: ProdClassApiResponse): boolean {
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


  async getAllProdClasses(): Promise<ProdClass[]> {
    try {
      const response = await apiCall.get<ProdClassApiResponse>(
        `${this.baseUrl}class`,
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

  async getProdClassById(id: number): Promise<ProdClass> {
    try {
      const response = await apiCall.get<ProdClassApiResponse>(
        `${this.baseUrl}class/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const classResponse = response.data?.[0];
      if (!classResponse) throw new Error("ProdClass not found");

      return classResponse;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching class with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createProdClass(data: ProdClassFormData): Promise<ProdClassApiResponse> {
    try {
      const response = await apiCall.post<ProdClassApiResponse>(
        `${this.baseUrl}class`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating class:", error);
      toast.error(error.message || "Failed to create class");
      throw error;
    }
  }

  async updateProdClass(id: number, data: Partial<ProdClassFormData>): Promise<ProdClassApiResponse> {
    try {
      const response = await apiCall.put<ProdClassApiResponse>(
        `${this.baseUrl}class`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateProdClass");

      return response;

    } catch (error: any) {
      console.error(`Error updating class with id ${id}:`, error);
      toast.error(error.message || "Failed to update class");
      throw error;
    }
  }

  async deleteProdClass(id: number): Promise<ProdClassApiResponse> {
    try {
      const response = await apiCall.delete<ProdClassApiResponse>(
        `${this.baseUrl}class`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response); // ✅ run before return

      return response; // ✅ return full response

    } catch (error: any) {
      console.error(`Error deleting class with id ${id}:`, error);
      toast.error(error.message || "Failed to delete class");
      throw error;
    }
  }
}

export const prodClassService = new ProdClassService();