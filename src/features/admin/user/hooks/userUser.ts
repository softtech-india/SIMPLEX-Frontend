import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { DeleteUserResponse, UserFormData } from '../types/user';
import { toast } from 'sonner';


export const BRANCH_KEYS = {
  all: ['userlist'] as const,
  lists: () => [...BRANCH_KEYS.all, 'list'] as const,
  list: () => [...BRANCH_KEYS.lists()] as const,
  details: () => [...BRANCH_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...BRANCH_KEYS.details(), id] as const,
};

export function useUsers() {

  return useQuery({
    queryKey: BRANCH_KEYS.list(),
    queryFn: () => userService.getAllUser(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useUser(id: number) {

  return useQuery({
    queryKey: BRANCH_KEYS.detail(id),
    queryFn: () => userService.getUserById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormData) => userService.createUser(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create user ");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || String(err));
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormData }) =>
      userService.updateUser(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update user ");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user ");
    },
  });
}


export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete user ");
    },
  });
}


