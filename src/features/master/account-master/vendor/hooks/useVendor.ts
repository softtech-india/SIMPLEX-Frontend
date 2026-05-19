import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '../services/vendorService';
import { VendorFormData } from '../types/vendor.types';
import { toast } from 'sonner';


export const VENDOR_KEYS = {
  all: ['vendors'] as const,
  lists: () => [...VENDOR_KEYS.all, 'list'] as const,
  list: () => [...VENDOR_KEYS.lists()] as const,
  details: () => [...VENDOR_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...VENDOR_KEYS.details(), id] as const,
};

export function useVendorList() {
  return useQuery({
    queryKey: VENDOR_KEYS.list(),
    queryFn: () => vendorService.getAllVendors(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useVendorById(id: number) {
  return useQuery({
    queryKey: VENDOR_KEYS.detail(id),
    queryFn: () => vendorService.getVendorById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VendorFormData) =>
      vendorService.createVendor(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: VENDOR_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create ledger");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating ledger");
    },
  });
}


export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VendorFormData }) =>
      vendorService.updateVendor(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: VENDOR_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: VENDOR_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update ledger");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update ledger");
    },
  });
}


export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vendorService.deleteVendor(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete ledger");
    },
  });
}