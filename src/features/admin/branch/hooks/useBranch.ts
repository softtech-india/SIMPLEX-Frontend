import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService } from '../services/branchService';
import { Branch, BranchFormData } from '../types/branch.types';
import { useToast } from '@/common/hooks/useToast';
import { toast } from 'sonner';


export const BRANCH_KEYS = {
  all: ['branchlist'] as const,
  lists: () => [...BRANCH_KEYS.all, 'list'] as const,
  list: () => [...BRANCH_KEYS.lists()] as const,
  details: () => [...BRANCH_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...BRANCH_KEYS.details(), id] as const,
};

export function useBranches() {

  return useQuery({
    queryKey: BRANCH_KEYS.list(),
    queryFn: () => branchService.getAllBranch(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useBranch(id: number) {

  return useQuery({
    queryKey: BRANCH_KEYS.detail(id),
    queryFn: () => branchService.getBranchById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchFormData) => branchService.createBranch(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create branch");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BranchFormData }) =>
      branchService.updateBranch(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update branch");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update branch");
    },
  });
}


export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => branchService.deleteBranch(id),

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete branch");
    },
  });
}