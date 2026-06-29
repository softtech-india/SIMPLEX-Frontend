import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pickListService } from '../services/pickListService';
import { PickListFormType } from '../types/pickList.types';
import { toast } from 'sonner';

export interface GetPickListParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UsePickListByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const PICK_LIST_KEYS = {
  all: ["pick-list"] as const,
  lists: () => [...PICK_LIST_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) => [...PICK_LIST_KEYS.lists(), params ?? {}] as const,
  details: () => [...PICK_LIST_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PICK_LIST_KEYS.details(), id] as const,
};

export function usePickList(params: GetPickListParams) {
  return useQuery({
    queryKey: PICK_LIST_KEYS.list(params),
    queryFn: () => pickListService.getAllPickLists(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function usePickListById(params: UsePickListByIdParams) {
  return useQuery({
    queryKey: PICK_LIST_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      pickListService.getPickListById({
        id: params.id!,
        userid: params.userid,
        compid: params.compid,
        branchid: params.branchid,
        finid: params.finid,
      }),

    enabled: !!params.id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
}

export function useCreatePickList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PickListFormType) =>
      pickListService.createPickList(data),

    onSuccess: (data) => {

      if (!data.success) {
        toast.error(data.message); return;
      }
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PICK_LIST_KEYS.list() });

    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating Pick List");
    },
  });
}

export function useApprovePickList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PickListFormType) => pickListService.approvePickList(data),

    onSuccess: (data) => {

      if (!data?.success) {
        toast.error(data?.message || "Failed to create pick list");
        return;
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PICK_LIST_KEYS.list() });

    },

    onError: (err: Error) => {
      toast.error(err.message || "Error while approving Pick List");
    },
  });
}


export function useUpdatePickList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PickListFormType }) =>
      pickListService.updatePickList(id, data),

    onSuccess: (data) => {

      if (!data?.success) {
        toast.error(data?.message || "Failed to update pick list");
        return;
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: PICK_LIST_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: PICK_LIST_KEYS.details() });

    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update Pick List");
    },
  });
}

export function useDeletePickList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: number;
      userid: number;
      compid: number;
    }) => pickListService.deletePickList(params),

    onSuccess: (data: any) => {

      if (!data?.success) {
        toast.error(data?.message || "Failed to Delete pick list");
        return;
      }

      toast.success(data?.message || "Deleted successfully");
      queryClient.invalidateQueries({ queryKey: PICK_LIST_KEYS.list() });

    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete Pick List");
    },
  });
}