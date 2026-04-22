import { apiCall } from "@/utils/apiClient";
import { UserBranchMapping, UserBranchMappingFormType, UserBranchMappingApiResponse } from '../types/userBranchMapping.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class UserBranchMappingService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");


  private handleError(response: UserBranchMappingApiResponse): boolean {
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

  async getAllUserBranchMappings(mapuserid : number): Promise<UserBranchMapping[]> {
    try {
      const response = await apiCall.get<UserBranchMappingApiResponse>(
        `${this.baseUrl}userbranchmapping`,
        { userid: this.getUserId(), mapuserid }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching getAllUserBranchMappings:", error);
      toast.error(error.message || "Failed to fetch user branch mappings");
      throw error;
    }
  }

  async createUserBranchMapping(data: UserBranchMappingFormType): Promise<UserBranchMappingApiResponse> {
    try {
      const response = await apiCall.post<UserBranchMappingApiResponse>(
        `${this.baseUrl}userbranchmapping`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating user branch mapping:", error);
      toast.error(error.message || "Failed to create user branch mapping");
      throw error;
    }
  }

  async getUserBranchMappingById(mapuserid: number, brnchid: number, compid: number): Promise<UserBranchMapping> {
    try {
      const response = await apiCall.get<UserBranchMappingApiResponse>(
        `${this.baseUrl}userbranchmapping/id`,
        { userid: this.getUserId(), mapuserid, brnchid, compid }
      );

      this.handleError(response);

      const data = response.data?.[0];
      if (!data) throw new Error("User branch mapping not found");

      return data;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
     // toast.error(`Error fetching user branch mapping with id ${mapuserid} and branch id ${brnchid}: ${message}`);
      throw new Error(message);
    }
  }

  async updateUserBranchMapping(id: number, data: Partial<UserBranchMappingFormType>): Promise<UserBranchMappingApiResponse> {
    try {
      const response = await apiCall.put<UserBranchMappingApiResponse>(
        `${this.baseUrl}userbranchmapping`,
        { ...data, id },
        { userid: this.getUserId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateUserBranchMapping");

      return response;

    } catch (error: any) {
      console.error(`Error updating user branch mapping with id ${id}:`, error);
      toast.error(error.message || "Failed to update user branch mapping");
      throw error;
    }
  }

  async deleteUserBranchMapping(compid: number, brnchid: number, mapuserid: number): Promise<UserBranchMappingApiResponse> {
    try {
      const response = await apiCall.delete<UserBranchMappingApiResponse>(
        `${this.baseUrl}userbranchmapping`,
        { userid: this.getUserId(), compid, brnchid, mapuserid }
      );

      this.handleError(response);
      return response;

    } catch (error: any) {
      console.error(`Error deleting user branch mapping with compid ${compid}, user id ${mapuserid}, and branch id ${brnchid}:`, error);
      toast.error(error.message || "Failed to delete user branch mapping");
      throw error;
    }
  }
}

export const userBranchMappingService = new UserBranchMappingService();