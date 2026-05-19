import { apiCall } from "@/utils/apiClient";
import { UserGroup, UserGroupFormData, UserGroupApiResponse } from '../types/userGroup.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class UserGroupService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");

  private handleError(response: UserGroupApiResponse): boolean {
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


  async getAllUserGroup(): Promise<UserGroup[]> {
    try {
      const response = await apiCall.get<UserGroupApiResponse>(
        `${this.baseUrl}usergroup`,
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

  async getUserGroupById(id: number): Promise<UserGroup> {
    try {
      const response = await apiCall.get<UserGroupApiResponse>(
        `${this.baseUrl}usergroup/id`,
        { userid: this.getUserId(), id }
      );

      this.handleError(response);

      const usergroup = response.data?.[0];
      if (!usergroup) throw new Error("UserGroup not found");

      return usergroup;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching usergroup with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createUserGroup(data: UserGroupFormData): Promise<UserGroupApiResponse> {
    try {
      const response = await apiCall.post<UserGroupApiResponse>(
        `${this.baseUrl}usergroup`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating usergroup:", error);
      toast.error(error.message || "Failed to create usergroup");
      throw error;
    }
  }

  async updateUserGroup(id: number, data: Partial<UserGroupFormData>): Promise<UserGroupApiResponse> {
    try {
      const response = await apiCall.put<UserGroupApiResponse>(
        `${this.baseUrl}usergroup`,
        { ...data, id },
        { userid: this.getUserId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateUserGroup");

      return response;

    } catch (error: any) {
      console.error(`Error updating usergroup with id ${id}:`, error);
      toast.error(error.message || "Failed to update usergroup");
      throw error;
    }
  }

  async deleteUserGroup(id: number): Promise<void> {
    try {
      const response = await apiCall.delete<UserGroupApiResponse>(
        `${this.baseUrl}usergroup`,
        { userid: this.getUserId(), id }
      );

      this.handleError(response);

    } catch (error: any) {
      console.error(`Error deleting usergroup with id ${id}:`, error);
      toast.error(error.message || "Failed to delete usergroup");
      throw error;
    }
  }
}

export const userGroupService = new UserGroupService();