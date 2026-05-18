import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prodUnitService } from '../services/prodUnit';
import { ProdUnitFormData } from '../types/prodUnit.types';
import { toast } from 'sonner';


export const PROD_UNIT_KEYS = {
  all: ['prodUnitlist'] as const,
  lists: () => [...PROD_UNIT_KEYS.all, 'list'] as const,
  list: () => [...PROD_UNIT_KEYS.lists()] as const,
  details: () => [...PROD_UNIT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_UNIT_KEYS.details(), id] as const,
};

export const GST_UNIT_KEYS = {
  all: ['gstUnit'] as const,
  list: () => [...GST_UNIT_KEYS.all, 'list'] as const,
};

export function useGstUnit() {

  return useQuery({
    queryKey: GST_UNIT_KEYS.list(),
    queryFn: () => prodUnitService.getAllGstUnits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}
export function useProdUnits() {

  return useQuery({
    queryKey: PROD_UNIT_KEYS.list(),
    queryFn: () => prodUnitService.getAllProdUnits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useProdUnit(id: number) {

  return useQuery({
    queryKey: PROD_UNIT_KEYS.detail(id),
    queryFn: () => prodUnitService.getProdUnitById(id),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCreateProdUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdUnitFormData) => prodUnitService.createProdUnit(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PROD_UNIT_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create unit");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateProdUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdUnitFormData }) =>
      prodUnitService.updateProdUnit(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PROD_UNIT_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: PROD_UNIT_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user unit");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user unit");
    },
  });
}


export function useDeleteProdUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => prodUnitService.deleteProdUnit(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: PROD_UNIT_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete branch");
    },
  });
}