import { apiCall } from "@/utils/apiClient";
import { Product, ProductFormData, HSN, HSNApiResponse, GST, GSTApiResponse, ProductApiResponse, ProdCategory, ProdCategoryApiResponse, ProdClass, ProdClassApiResponse, ProdGroup, ProdGroupApiResponse, ProdUnit, ProdUnitApiResponse } from '../types/product.types';
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";
import { handleApiResponse } from "@/helpers/apiResponseHandler";

class ProductService {

  private readonly baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

  private getFromStorage = (key: string): string => {
    return storageService.getItem(key) || "";
  };

  private getUserId = (): string => this.getFromStorage("userId");
  private getCompanyId = (): string => this.getFromStorage("companyId");

  private handleError(response: ProductApiResponse): boolean {
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



  async getAllHSNs(): Promise<HSN[]> {
    try {
      const response = await apiCall.get<HSNApiResponse>(
        `${this.baseUrl}hsn`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching All HSN:", error);
      toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  }

  async getAllGSTs(): Promise<GST[]> {
    try {
      const response: any = await apiCall.get<GSTApiResponse>(
        `${this.baseUrl}gst`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching GSTs:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getAllCategories(): Promise<ProdCategory[]> {
    try {

      const response: any = await apiCall.get<ProdCategoryApiResponse>(
        `${this.baseUrl}category`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching GSTs:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getAllProdClasses(): Promise<ProdClass[]> {
    try {

      const response: any = await apiCall.get<ProdClassApiResponse>(
        `${this.baseUrl}class`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching GSTs:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getAllProdGroups(): Promise<ProdGroup[]> {
    try {

      const response: any = await apiCall.get<ProdGroupApiResponse>(
        `${this.baseUrl}productsubclass`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching GSTs:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getAllProdUnits(): Promise<ProdUnit[]> {
    try {

      const response: any = await apiCall.get<ProdUnitApiResponse>(
        `${this.baseUrl}unit`,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching GSTs:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {

      const response: any = await apiCall.get<ProductApiResponse>(
        `${this.baseUrl}product`,
        { userid: this.getUserId(), compid: this.getCompanyId(), skip: 0, take: 1000 }
      );

      return response.data || [];

    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to fetch");
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await apiCall.get<ProductApiResponse>(
        `${this.baseUrl}product/id`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id: id }
      );

      this.handleError(response);

      const product = response.data?.[0];
      if (!product) throw new Error("Product not found");

      return product;

    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error fetching product with id ${id}: ${message}`);
      throw new Error(message);
    }
  }

  async createProduct(data: ProductFormData): Promise<ProductApiResponse> {
    try {
      const response = await apiCall.post<ProductApiResponse>(
        `${this.baseUrl}product`,
        data,
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error("Error creating hsn:", error);
      toast.error(error.message || "Failed to create hsn");
      throw error;
    }
  }

  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<ProductApiResponse> {
    try {
      const response = await apiCall.put<ProductApiResponse>(
        `${this.baseUrl}product`,
        { ...data, id },
        { userid: this.getUserId(), compid: this.getCompanyId() }
      );

      this.handleError(response);

      if (!response) throw new Error("response not found at update hsn");

      return response;

    } catch (error: any) {
      console.error(`Error updating hsn with id ${id}:`, error);
      toast.error(error.message || "Failed to update hsn");
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<ProductApiResponse> {
    try {
      const response = await apiCall.delete<ProductApiResponse>(
        `${this.baseUrl}product`,
        { userid: this.getUserId(), compid: this.getCompanyId(), id }
      );

      this.handleError(response);

      return response;

    } catch (error: any) {
      console.error(`Error deleting hsn with id ${id}:`, error);
      toast.error(error.message || "Failed to delete hsn");
      throw error;
    }
  }

  async getProductQR(id: number): Promise<Blob> {
    try {
      const response = await apiCall.get<Blob>(
        `${this.baseUrl}product/qr`,
        {
          userid: this.getUserId(),
          compid: this.getCompanyId(),
          id,
        },
        undefined,
        'blob' // ✅ now correctly passed
      );

      return response;

    } catch (error: any) {
      console.error("Error fetching QR:", error);
      toast.error(error.message || "Failed to fetch QR");
      throw error;
    }
  }
}

export const productService = new ProductService();