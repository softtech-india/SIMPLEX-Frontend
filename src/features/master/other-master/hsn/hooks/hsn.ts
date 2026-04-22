import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hSNService } from '../services/hsn';
import { HSNFormData } from '../types/hsn.types';
import { toast } from 'sonner';


export const HSN_KEYS = {
  all: ['HSNlist'] as const,
  lists: () => [...HSN_KEYS.all, 'list'] as const,
  list: () => [...HSN_KEYS.lists()] as const,
  details: () => [...HSN_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...HSN_KEYS.details(), id] as const,
};

export const GST_KEYS = {
  all: ['gstUnit'] as const,
  list: () => [...GST_KEYS.all, 'list'] as const,
};

export function useGsts() {

  return useQuery({
    queryKey: GST_KEYS.list(),
    queryFn: () => hSNService.getAllGSTs(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}
export function useHSNs() {

  return useQuery({
    queryKey: HSN_KEYS.list(),
    queryFn: () => hSNService.getAllHSNs(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useHSN(id: number) {

  return useQuery({
    queryKey: HSN_KEYS.detail(id),
    queryFn: () => hSNService.getProdHSNById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateHSN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HSNFormData) => hSNService.createHSN(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: HSN_KEYS.list() });
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

export function useUpdateHSN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: HSNFormData }) =>
      hSNService.updateHSN(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: HSN_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: HSN_KEYS.details() });

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


export function useDeleteHSN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hSNService.deleteHSN(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: HSN_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete branch");
    },
  });
}