import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requisitionService } from '../services/requisitionService';
import { RequisitionFormType } from '../types/requisition.types';
import { toast } from 'sonner';

export interface GetRequisitionParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UseRequisitionByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const REQUISITION_KEYS = {
  all: ["requisition"] as const,

  lists: () => [...REQUISITION_KEYS.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...REQUISITION_KEYS.lists(), params ?? {}] as const,

  details: () => [...REQUISITION_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...REQUISITION_KEYS.details(), id] as const,
};

export function useRequisitionList(params: GetRequisitionParams) {
  return useQuery({
    queryKey: REQUISITION_KEYS.list(params),

    queryFn: () =>
      requisitionService.getAllRequisitions(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useRequisitionById(params: UseRequisitionByIdParams) {
  return useQuery({
    queryKey: REQUISITION_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      requisitionService.getRequisitionById({
        id: params.id!,
        userid: params.userid,
        compid: params.compid,
        branchid: params.branchid,
        finid: params.finid,
      }),

    enabled: !!params.id, // only run when id exists

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequisitionFormType) =>
      requisitionService.createRequisition(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: REQUISITION_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create requisition order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating requisition order");
    },
  });
}


export function useUpdateRequisition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RequisitionFormType }) =>
      requisitionService.updateRequisition(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: REQUISITION_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: REQUISITION_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update requisition order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update requisition order");
    },
  });
}


export const useDeleteRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requisitionService.deleteRequisition(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: REQUISITION_KEYS.list() });
      // Handle both response structures
      const successMessage = data?.message || data?.data?.message || "Requisition deleted successfully";
      toast.success(successMessage);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete requisition");
    },
  });
};