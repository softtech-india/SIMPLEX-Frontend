import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { directSaleService } from '../services/directSaleService';
import { DirectSaleFormType } from '../types/directSale.types';
import { toast } from 'sonner';

export interface GetDirectSaleParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UseDirectSaleByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const DIRECT_SALE_KEYS = {
  all: ["direct-sale"] as const,
  lists: () => [...DIRECT_SALE_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) => [...DIRECT_SALE_KEYS.lists(), params ?? {}] as const,
  details: () => [...DIRECT_SALE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DIRECT_SALE_KEYS.details(), id] as const,
};

export function useDirectSaleList(params: GetDirectSaleParams) {
  return useQuery({
    queryKey: DIRECT_SALE_KEYS.list(params),
    queryFn: () => directSaleService.getAllDirectSales(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useDirectSaleById(params: UseDirectSaleByIdParams) {
  return useQuery({
    queryKey: DIRECT_SALE_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      directSaleService.getDirectSaleById({
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

export function useCreateDirectSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DirectSaleFormType) =>
      directSaleService.createDirectSale(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create direct sale");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating direct sale");
    },
  });
}

export function useApproveDirectSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DirectSaleFormType) => directSaleService.approveDirectSale(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to approve direct sale");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error while approving direct sale");
    },
  });
}


export function useUpdateDirectSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DirectSaleFormType }) =>
      directSaleService.updateDirectSale(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update direct sale");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update direct sale");
    },
  });
}

export function useDeleteDirectSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: number;
      userid: number;
      compid: number;
    }) => directSaleService.deleteDirectSale(params),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });
      toast.success(data?.message || "Deleted successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete direct sale");
    },
  });
}