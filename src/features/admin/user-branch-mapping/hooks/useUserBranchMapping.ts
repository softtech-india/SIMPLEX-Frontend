import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userBranchMappingService } from '../services/userBranchMappingService';
import { UserBranchMappingFormType } from '../types/userBranchMapping.types';
import { toast } from 'sonner';


export const USER_BRANCH_KEYS = {
  all: ['user-branch-mapping-list'] as const,
  lists: () => [...USER_BRANCH_KEYS.all, 'list'] as const,
  list: () => [...USER_BRANCH_KEYS.lists()] as const,
  details: () => [...USER_BRANCH_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...USER_BRANCH_KEYS.details(), id] as const,
};

export function useUserBranchMappingList(mapuserid: number) {

  return useQuery({
    queryKey: USER_BRANCH_KEYS.list(),
    queryFn: () => userBranchMappingService.getAllUserBranchMappings(mapuserid),
    enabled: !!mapuserid,
    staleTime: 0,
    gcTime: 0,

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useUserBranchMapping(mapuserid: number, brnchid: number, compid: number) {

  return useQuery({
    queryKey: [...USER_BRANCH_KEYS.detail(mapuserid), brnchid],
    queryFn: () => userBranchMappingService.getUserBranchMappingById(mapuserid, brnchid, compid),
    enabled: !!mapuserid && !!brnchid,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateUserBranchMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserBranchMappingFormType) => userBranchMappingService.createUserBranchMapping(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: USER_BRANCH_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create user branch mapping ");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create user branch mapping ");
    },
  });
}

export function useUpdateUserBranchMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserBranchMappingFormType }) =>
      userBranchMappingService.updateUserBranchMapping(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: USER_BRANCH_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: USER_BRANCH_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user branch mapping ");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user branch mapping ");
    },
  });
}

type DeletePayload = {
  compid: number;
  brnchid: number;
  mapuserid: number;
};

export function useDeleteUserBranchMapping(compid: number, brnchid: number, mapuserid: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeletePayload) =>
      userBranchMappingService.deleteUserBranchMapping(
        payload.compid,
        payload.brnchid,
        payload.mapuserid
      ),


    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: USER_BRANCH_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete user branch mapping ");
    },
  });
}


