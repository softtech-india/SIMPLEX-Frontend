import { apiCall } from "@/utils/apiClient";
import { Customer, CustomerFormData, CustomerApiResponse, SubLedgerType, SubLedgerApiResponse } from '../types/customer.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class CustomerService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;
  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: CustomerApiResponse | SubLedgerApiResponse): boolean {
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

  async getAllSubLedgers(): Promise<SubLedgerType[]> {
    try {
      const response = await apiCall.get<SubLedgerApiResponse>(
        `${this.baseUrl}subledgertype`,
        { userid: this.getUserId(), compid: this.getCompanyId(), nature: "CU" }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching customer:", error);
      toast.error(error.message || "Failed to fetch customer");
      throw error;
    }
  }


  async getAllCustomer(): Promise<Customer[]> {
    try {
      const response = await apiCall.get<CustomerApiResponse>(
        `${this.baseUrl}customer`,
        { userid: this.getUserId(), compid: this.getCompanyId(), skip: 0, take: 10000 }
      );

      this.handleError(response);
      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching vencustomerdors:", error);
      toast.error(error.message || "Failed to fetch customer");
      throw error;
    }
  }

  async getCustomerById(id: number): Promise<Customer> {
    try {
      const response = await apiCall.get<CustomerApiResponse>(
        `${this.baseUrl}customer/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      const Customer = response.data?.[0];
      if (!Customer) throw new Error("Customer not found");

      return Customer;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching Customer with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createCustomer(data: CustomerFormData): Promise<CustomerApiResponse> {
    try {
      const response = await apiCall.post<CustomerApiResponse>(
        `${this.baseUrl}customer`,
        data,
        { userid: this.getUserId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating customer:", error);
      toast.error(error.message || "Failed to create customer");
      throw error;
    }
  }

  async updateCustomer(id: number, data: Partial<CustomerFormData>): Promise<CustomerApiResponse> {
    try {
      const response = await apiCall.put<CustomerApiResponse>(
        `${this.baseUrl}customer`,
        { ...data, id },
        { userId: this.getUserId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at customer");
      console.log(response)
      return response;

    } catch (error: any) {
      console.error(`Error updating customer with id ${id}:`, error);
      toast.error(error.message || "Failed to update customer");
      throw error;
    }
  }

  async deleteCustomer(id: number): Promise<CustomerApiResponse> {
    try {
      const response = await apiCall.delete<CustomerApiResponse>(
        `${this.baseUrl}customer`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);
      return response;

    } catch (error: any) {
      console.error(`Error deleting customer with id ${id}:`, error);
      toast.error(error.message || "Failed to delete customer");
      throw error;
    }
  }
}

export const customerService = new CustomerService();