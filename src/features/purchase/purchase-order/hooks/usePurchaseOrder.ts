import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseOrderService } from '../services/purchaseOrderService';
import { PurchaseOrderFormType } from '../types/purchaseOrder.types';
import { toast } from 'sonner';


export const PURCHASE_ORDER_KEYS = {
  all: ['ledgers'] as const,
  lists: () => [...PURCHASE_ORDER_KEYS.all, 'list'] as const,
  list: () => [...PURCHASE_ORDER_KEYS.lists()] as const,
  details: () => [...PURCHASE_ORDER_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PURCHASE_ORDER_KEYS.details(), id] as const,
};

export function usePurchaseOrderList() {
  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.list(),
    queryFn: () => purchaseOrderService.getAllPurchaseOrders(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function usePurchaseOrderById(id: number) {
  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.detail(id),
    queryFn: () => purchaseOrderService.getPurchaseOrderById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
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

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete purchase order");
    },
  });
}