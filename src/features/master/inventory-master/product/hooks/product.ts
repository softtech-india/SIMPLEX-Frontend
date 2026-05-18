import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product';
import { ProductFormData } from '../types/product.types';
import { toast } from 'sonner';


export const PRODUCT_KEYS = {
  all: ['Productlist'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: () => [...PRODUCT_KEYS.lists()] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PRODUCT_KEYS.details(), id] as const,
};

export const HSN_KEYS = {
  all: ['HSNlist'] as const,
  lists: () => [...HSN_KEYS.all, 'list'] as const,
  list: () => [...HSN_KEYS.lists()] as const,
  details: () => [...HSN_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...HSN_KEYS.details(), id] as const,
};

export const PROD_CATEGORIES_KEYS = {
  all: ['ProdCatlist'] as const,
  lists: () => [...PROD_CATEGORIES_KEYS.all, 'list'] as const,
  list: () => [...PROD_CATEGORIES_KEYS.lists()] as const,
  details: () => [...PROD_CATEGORIES_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_CATEGORIES_KEYS.details(), id] as const,
};

export const PROD_CLASSES_KEYS = {
  all: ['ProdClasslist'] as const,
  lists: () => [...PROD_CATEGORIES_KEYS.all, 'list'] as const,
  list: () => [...PROD_CATEGORIES_KEYS.lists()] as const,
  details: () => [...PROD_CATEGORIES_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_CATEGORIES_KEYS.details(), id] as const,
};

export const PROD_GROUP_KEYS = {
  all: ['ProdGrouplist'] as const,
  lists: () => [...PROD_GROUP_KEYS.all, 'list'] as const,
  list: () => [...PROD_GROUP_KEYS.lists()] as const,
  details: () => [...PROD_GROUP_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_GROUP_KEYS.details(), id] as const,
};

export const PROD_UNIT_KEYS = {
  all: ['ProdUnitlist'] as const,
  lists: () => [...PROD_UNIT_KEYS.all, 'list'] as const,
  list: () => [...PROD_UNIT_KEYS.lists()] as const,
  details: () => [...PROD_UNIT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_UNIT_KEYS.details(), id] as const,
};

export const GST_KEYS = {
  all: ['gstUnit'] as const,
  list: () => [...GST_KEYS.all, 'list'] as const,
};

export function useGsts() {

  return useQuery({
    queryKey: GST_KEYS.list(),
    queryFn: () => productService.getAllGSTs(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useHSNs() {

  return useQuery({
    queryKey: HSN_KEYS.list(),
    queryFn: () => productService.getAllHSNs(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useCategories() {

  return useQuery({
    queryKey: PROD_CATEGORIES_KEYS.list(),
    queryFn: () => productService.getAllCategories(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useClasses() {

  return useQuery({
    queryKey: PROD_CLASSES_KEYS.list(),
    queryFn: () => productService.getAllProdClasses(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useGroups() {

  return useQuery({
    queryKey: PROD_GROUP_KEYS.list(),
    queryFn: () => productService.getAllProdGroups(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useUnits() {

  return useQuery({
    queryKey: PROD_UNIT_KEYS.list(),
    queryFn: () => productService.getAllProdUnits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useProducts() {

  return useQuery({
    queryKey: PRODUCT_KEYS.list(),
    queryFn: () => productService.getAllProducts(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useProduct(id: number) {

  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => productService.createProduct(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create hsn");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) =>
      productService.updateProduct(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user hsn");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user hsn");
    },
  });
}


export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete branch");
    },
  });
}

export function useProductQR() {
  return useMutation({
    mutationFn: (id: number) => productService.getProductQR(id),
  });
}