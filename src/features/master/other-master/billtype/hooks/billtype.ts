import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billTypeService } from '../services/billtype';
import { BillTypeFormData } from '../types/billtype.types';
import { toast } from 'sonner';


export const BILLTYPE_KEYS = {
  all: ['BillTypelist'] as const,
  lists: () => [...BILLTYPE_KEYS.all, 'list'] as const,
  list: () => [...BILLTYPE_KEYS.lists()] as const,
  details: () => [...BILLTYPE_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...BILLTYPE_KEYS.details(), id] as const,
};


export function useBillTypes() {

  return useQuery({
    queryKey: BILLTYPE_KEYS.list(),
    queryFn: () => billTypeService.getAllBillTypes(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useBillType(id: number) {

  return useQuery({
    queryKey: BILLTYPE_KEYS.detail(id),
    queryFn: () => billTypeService.getProdBillTypeById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateBillType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BillTypeFormData) => billTypeService.createBillType(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BILLTYPE_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create Bill type");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateBillType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BillTypeFormData }) =>
      billTypeService.updateBillType(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BILLTYPE_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: BILLTYPE_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update Bill type");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user Bill type");
    },
  });
}


export function useDeleteBillType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => billTypeService.deleteBillType(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: BILLTYPE_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete Bill type");
    },
  });
}