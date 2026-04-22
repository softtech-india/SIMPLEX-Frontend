import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prodGroupService } from '../services/prodGroup';
import { ProdGroupFormData } from '../types/prodGroup.types';
import { toast } from 'sonner';


export const PROD_GROUP_KEYS = {
  all: ['prodGrouplist'] as const,
  lists: () => [...PROD_GROUP_KEYS.all, 'list'] as const,
  list: () => [...PROD_GROUP_KEYS.lists()] as const,
  details: () => [...PROD_GROUP_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PROD_GROUP_KEYS.details(), id] as const,
};

export function useProdGroups() {

  return useQuery({
    queryKey: PROD_GROUP_KEYS.list(),
    queryFn: () => prodGroupService.getAllProdGroups(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useProdGroup(id: number) {

  return useQuery({
    queryKey: PROD_GROUP_KEYS.detail(id),
    queryFn: () => prodGroupService.getProdGroupById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateProdGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdGroupFormData) => prodGroupService.createProdGroup(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PROD_GROUP_KEYS.list() });
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

export function useUpdateProdGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdGroupFormData }) =>
      prodGroupService.updateProdGroup(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PROD_GROUP_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: PROD_GROUP_KEYS.details() });

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


export function useDeleteProdGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => prodGroupService.deleteProdGroup(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: PROD_GROUP_KEYS.list() });
      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete branch");
    },
  });
}