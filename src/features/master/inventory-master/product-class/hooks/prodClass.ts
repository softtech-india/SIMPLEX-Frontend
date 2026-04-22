import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prodClassService } from '../services/prodClass';
import { ProdClassFormData } from '../types/prodClass.types';
import { toast } from 'sonner';


export const PROD_CLASS_KEYS = {
  all: ['prodClasslist'] as const,
  lists: () => [...PROD_CLASS_KEYS.all, 'list'] as const,
  list: () => [...PROD_CLASS_KEYS.lists()] as const,
  details: () => [...PROD_CLASS_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_CLASS_KEYS.details(), id] as const,
};

export function useProdClasses() {

  return useQuery({
    queryKey: PROD_CLASS_KEYS.list(),
    queryFn: () => prodClassService.getAllProdClasses(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useProdClass(id: number) {

  return useQuery({
    queryKey: PROD_CLASS_KEYS.detail(id),
    queryFn: () => prodClassService.getProdClassById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateProdClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdClassFormData) => prodClassService.createProdClass(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PROD_CLASS_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create user group");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateProdClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdClassFormData }) =>
      prodClassService.updateProdClass(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PROD_CLASS_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: PROD_CLASS_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user group");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user group");
    },
  });
}


export function useDeleteProdClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => prodClassService.deleteProdClass(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: PROD_CLASS_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete branch");
    },
  });
}