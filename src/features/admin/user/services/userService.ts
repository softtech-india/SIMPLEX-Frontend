import { apiCall } from "@/utils/apiClient";
import { User, UserFormData, UserApiResponse} from '../types/user';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class UserService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");

  private handleError(response: UserApiResponse) {
    if (!response.success) {
      const message = response.message || "Something went wrong";
      toast.error(message);
      throw new Error(message);
    }
  }

  async getAllUser(): Promise<User[]> {
    try {
      const response = await apiCall.get<UserApiResponse>(
        `${this.baseUrl}user`,
        { userid: this.getUserId() }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Failed to fetch users");
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await apiCall.get<UserApiResponse>(
        `${this.baseUrl}user/id`,
        { userid: this.getUserId(), id }
      );

      this.handleError(response);

      const user = response.data?.[0];
      if (!user) throw new Error("User not found");

      return user;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching user with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createUser(data: UserFormData): Promise<UserApiResponse> {
    try {
      const response = await apiCall.post<UserApiResponse>(
        `${this.baseUrl}user`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<UserFormData>): Promise<UserApiResponse> {
    try {
      const response = await apiCall.put<UserApiResponse>(
        `${this.baseUrl}user`,
        { ...data, id },
        { userid: this.getUserId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at updateUser");

      return response;

    } catch (error: any) {
      console.error(`Error updating user with id ${id}:`, error);
      toast.error(error.message || "Failed to update user");
      throw error;
    }
  }

  async deleteUser(id: number): Promise<UserApiResponse> {
    try {
      const response = await apiCall.delete<UserApiResponse>(
        `${this.baseUrl}user`,
        { userid: this.getUserId(), id }
      );

      this.handleError(response);
      return response;

    } catch (error: any) {
      console.error(`Error deleting user with id ${id}:`, error);
      toast.error(error.message || "Failed to delete user");
      throw error;
    }
  }
}

export const userService = new UserService();