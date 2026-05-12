// sales-order-register/services/salesOrderService.ts
import { apiCall } from "@/utils/apiClient";
import { SalesOrderParams, SalesOrder, SalesOrderApiResponse, Customer, CustomerApiResponse } from '../types/salesOrder.type';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

class SalesOrderService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  async getAllSalesOrders(params: SalesOrderParams): Promise<SalesOrder[]> {
    try {
      const response = await apiCall.get<SalesOrderApiResponse>(
        `${this.baseUrl}soreg`,
        params
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching sales orders:", error);
      toast.error(error.message || "Failed to fetch sales orders");
      throw error;
    }
  }

  async getAllBrands(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}category`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      return [];
    }
  }

  async getAllClasses(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}class`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      return [];
    }
  }

  async getAllSubClasses(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}productsubclass`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching subclasses:", error);
      return [];
    }
  }

  async getAllCustomers(userid: number, compid: number): Promise<Customer[]> {
    try {
      const response = await apiCall.get<CustomerApiResponse>(
        `${this.baseUrl}customer`,
        { userid, compid, skip: 0, take: 10000 }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      toast.error(error.message || "Failed to fetch customers");
      throw error;
    }
  }

  async getAllStates(): Promise<any[]> {
    try {
      const response = await apiCall.get<any>(
        `${this.baseUrl}state`,
        { userid: this.getUserId() }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching states:", error);
      return [];
    }
  }
}

export const salesOrderService = new SalesOrderService();