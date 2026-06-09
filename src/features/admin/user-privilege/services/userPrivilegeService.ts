import { apiCall } from "@/utils/apiClient";
import type { ApiResponse, UserItem, UserPrivilege } from "../types/userPrivilege.types";

class UserPrivilegeService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  async fetchUsersListByAdmin(): Promise<UserItem[]> {

    try {

      const response: ApiResponse<UserItem[]> = await apiCall.get(
        `${this.baseUrl}user`,
        { userid: 1 }
      );

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch users");
      }

      return response?.data || [];

    } catch (error) {
      console.error("fetchUsersListByAdmin error:", error);
      return [];
    }
  }

  async fetchUserPrivileges(
    userId: number
  ): Promise<UserPrivilege[]> {

    try {

      const response: ApiResponse<UserPrivilege[]> =
        await apiCall.get(
          `${this.baseUrl}userpreviledge`,
          {
            userid: 1,
            id: userId,
          }
        );

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch privileges");
      }

      return response?.data || [];

    } catch (error) {
      console.error("fetchUserPrivileges error:", error);
      return [];
    }
  }

  async saveUserPrivileges(
    userId: number,
    payload: Partial<UserPrivilege>[]
  ): Promise<ApiResponse<any>> {

    return await apiCall.post(
      `${this.baseUrl}userpreviledge`,
      payload,
      {
        userid: 1,
        id: userId,
      }
    );
  }
}

export const userPrivilegeService = new UserPrivilegeService();