import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vouchernumberingService } from '../services/voucherNumbering';
import { VoucherNumberingFormData } from '../types/vouchernumbering.types';
import { toast } from 'sonner';


export const VoucherNumbering_KEYS = {
  all: ['Godownlist'] as const,
  lists: () => [...VoucherNumbering_KEYS.all, 'list'] as const,
  list: () => [...VoucherNumbering_KEYS.lists()] as const,
  details: () => [...VoucherNumbering_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...VoucherNumbering_KEYS.details(), id] as const,
};


export function useVoucherNumberings() {

  return useQuery({
    queryKey: VoucherNumbering_KEYS.list(),
    queryFn: () => vouchernumberingService.getAllVoucherNumberings(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useVoucherNumbering(id: number) {

  return useQuery({
    queryKey: VoucherNumbering_KEYS.detail(id),
    queryFn: () => vouchernumberingService.getProdVoucherNumberingId(id),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCreateVoucherNumbering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VoucherNumberingFormData) => vouchernumberingService.createVoucherNumbering(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: VoucherNumbering_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create godown");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateVoucherNumbering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VoucherNumberingFormData }) =>
      vouchernumberingService.updateVoucherNumbering(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: VoucherNumbering_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: VoucherNumbering_KEYS.details() });

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


export function useDeleteVoucherNumbering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vouchernumberingService.deleteVoucherNumbering(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: VoucherNumbering_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete godown");
    },
  });
}