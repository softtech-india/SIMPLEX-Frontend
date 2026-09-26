import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prodCategoryService } from '../services/prodCategory';
import { ProdCategoryFormData } from '../types/prodCategory.types';
import { toast } from 'sonner';


export const PROD_CATEGORY_KEYS = {
  all: ['prodCategorylist'] as const,
  lists: () => [...PROD_CATEGORY_KEYS.all, 'list'] as const,
  list: () => [...PROD_CATEGORY_KEYS.lists()] as const,
  details: () => [...PROD_CATEGORY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_CATEGORY_KEYS.details(), id] as const,
};

export function useProdCategories() {

  return useQuery({
    queryKey: PROD_CATEGORY_KEYS.list(),
    queryFn: () => prodCategoryService.getAllProdCategories(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useProdCategory(id: number) {

  return useQuery({
    queryKey: PROD_CATEGORY_KEYS.detail(id),
    queryFn: () => prodCategoryService.getProdCategoryById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCreateProdCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdCategoryFormData) => prodCategoryService.createProdCategory(data),
    onSuccess: (data) => {

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PROD_CATEGORY_KEYS.list(), });

    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create product category ");
    },
  });
}

export function useUpdateProdCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdCategoryFormData }) =>
      prodCategoryService.updateProdCategory(id, data),

    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Failed to update product category");
        return;
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PROD_CATEGORY_KEYS.list(), });
      queryClient.invalidateQueries({ queryKey: PROD_CATEGORY_KEYS.details(), });

    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update product category ");
    },
  });
}


export function useDeleteProdCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: number;
      userid: number;
      compid: number;
    }) => prodCategoryService.deleteProdCategory(params),

    onSuccess: (data: any) => {

      if (!data?.success) {
        toast.error(data?.message || "Failed to Delete product category");
        return;
      }
      toast.success(data?.message || "Deleted successfully");
      queryClient.invalidateQueries({ queryKey: PROD_CATEGORY_KEYS.list(), });

    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete product category");
    },
  });
}