import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { finyearService } from '../services/finyearService';
import { Finyear, FinyearFormData } from '../types/finyear.types';
import { toast } from 'sonner';


export const FINYEAR_KEYS = {
  all: ['finyearlist'] as const,
  lists: () => [...FINYEAR_KEYS.all, 'list'] as const,
  list: () => [...FINYEAR_KEYS.lists()] as const,
  details: () => [...FINYEAR_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...FINYEAR_KEYS.details(), id] as const,
};

export function useFinyears() {

  return useQuery({
    queryKey: FINYEAR_KEYS.list(),
    queryFn: () => finyearService.getAllFinyear(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useFinyear(id: number) {

  return useQuery({
    queryKey: FINYEAR_KEYS.detail(id),
    queryFn: () => finyearService.getFinyearById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateFinyear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FinyearFormData) => finyearService.createFinyear(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: FINYEAR_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create financial year");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateFinyear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FinyearFormData }) =>
      finyearService.updateFinyear(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: FINYEAR_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: FINYEAR_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update financial year");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update financial year");
    },
  });
}

export function useDeleteFinyear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => finyearService.deleteFinyear(id),

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: FINYEAR_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete financial year");
    },
  });
}