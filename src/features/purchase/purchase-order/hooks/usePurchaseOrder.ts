import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseOrderService } from '../services/purchaseOrderService';
import { PurchaseOrderFormType } from '../types/purchaseOrder.types';
import { toast } from 'sonner';

export interface GetPurchaseOrderParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UsePurchaseOrderByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const PURCHASE_ORDER_KEYS = {
  all: ["purchase-order"] as const,

  lists: () => [...PURCHASE_ORDER_KEYS.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...PURCHASE_ORDER_KEYS.lists(), params ?? {}] as const,

  details: () => [...PURCHASE_ORDER_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...PURCHASE_ORDER_KEYS.details(), id] as const,
};

export function usePurchaseOrderList(params: GetPurchaseOrderParams) {
  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.list(params),

    queryFn: () =>
      purchaseOrderService.getAllPurchaseOrders(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function usePurchaseOrderById(params: UsePurchaseOrderByIdParams) {
  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      purchaseOrderService.getPurchaseOrderById({
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

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PurchaseOrderFormType) =>
      purchaseOrderService.createPurchaseOrder(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create purchase order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating purchase order");
    },
  });
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PurchaseOrderFormType) =>
      purchaseOrderService.approvePurchaseOrder(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to approve purchase order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error while approving purchase order");
    },
  });
}


export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PurchaseOrderFormType }) =>
      purchaseOrderService.updatePurchaseOrder(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update purchase order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update purchase order");
    },
  });
}


export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => purchaseOrderService.deletePurchaseOrder(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete purchase order");
    },
  });
}