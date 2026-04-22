import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userGroupService } from '../services/userGroupService';
import { UserGroupFormData } from '../types/userGroup.types';
import { toast } from 'sonner';


export const BRANCH_KEYS = {
  all: ['userGrouplist'] as const,
  lists: () => [...BRANCH_KEYS.all, 'list'] as const,
  list: () => [...BRANCH_KEYS.lists()] as const,
  details: () => [...BRANCH_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...BRANCH_KEYS.details(), id] as const,
};

export function useUserGroups() {

  return useQuery({
    queryKey: BRANCH_KEYS.list(),
    queryFn: () => userGroupService.getAllUserGroup(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

  });
}

export function useUserGroup(id: number) {

  return useQuery({
    queryKey: BRANCH_KEYS.detail(id),
    queryFn: () => userGroupService.getUserGroupById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateUserGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserGroupFormData) => userGroupService.createUserGroup(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
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

export function useUpdateUserGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserGroupFormData }) =>
      userGroupService.updateUserGroup(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.details() });

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


export function useDeleteUserGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userGroupService.deleteUserGroup(id),

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete user group");
    },
  });
}