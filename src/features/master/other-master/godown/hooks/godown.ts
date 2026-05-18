import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { godownService } from '../services/godown';
import { GodownFormData } from '../types/godown.types';
import { toast } from 'sonner';


export const GODOWN_KEYS = {
  all: ['Godownlist'] as const,
  lists: () => [...GODOWN_KEYS.all, 'list'] as const,
  list: () => [...GODOWN_KEYS.lists()] as const,
  details: () => [...GODOWN_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...GODOWN_KEYS.details(), id] as const,
};


export function useGodowns() {

  return useQuery({
    queryKey: GODOWN_KEYS.list(),
    queryFn: () => godownService.getAllGodowns(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useGodown(id: number) {

  return useQuery({
    queryKey: GODOWN_KEYS.detail(id),
    queryFn: () => godownService.getProdGodownById(id),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCreateGodown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GodownFormData) => godownService.createGodown(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GODOWN_KEYS.list() });
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

export function useUpdateGodown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GodownFormData }) =>
      godownService.updateGodown(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GODOWN_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: GODOWN_KEYS.details() });

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


export function useDeleteGodown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => godownService.deleteGodown(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: GODOWN_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete godown");
    },
  });
}