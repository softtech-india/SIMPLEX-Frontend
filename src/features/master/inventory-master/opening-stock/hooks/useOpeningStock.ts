import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openingStockService } from '../services/openingStockService';
import { OpeningStockFormType } from '../types/openingStock';
import { toast } from 'sonner';

export interface GetOpeningStockParams {
  userid: number;
  compid: number;
  branchid?: number;
  finid?: number;
  enddt?: string;
}

type UseOpeningStockByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const OPENING_STOCK_KEYS = {
  all: ["purchase-order"] as const,

  lists: () => [...OPENING_STOCK_KEYS.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...OPENING_STOCK_KEYS.lists(), params ?? {}] as const,

  details: () => [...OPENING_STOCK_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...OPENING_STOCK_KEYS.details(), id] as const,
};

export function useOpeningStockList(params: GetOpeningStockParams) {
  return useQuery({
    queryKey: OPENING_STOCK_KEYS.list(params),

    queryFn: () =>
      openingStockService.getAllOpeningStocks(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// export function usePurchaseOrderList() {
//   return useQuery({
//     queryKey: PURCHASE_ORDER_KEYS.list(),
//     queryFn: () => purchaseOrderService.getAllPurchaseOrders(),

//     staleTime: 0,
//     gcTime: 0,

//     refetchOnMount: 'always',
//     refetchOnWindowFocus: true,
//     refetchOnReconnect: true,
//   });
// }

export function useOpeningStockById(params: UseOpeningStockByIdParams) {
  return useQuery({
    queryKey: OPENING_STOCK_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      openingStockService.getOpeningStockById({
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

// export function usePurchaseOrderById(id: number) {
//   return useQuery({
//     queryKey: PURCHASE_ORDER_KEYS.detail(id),
//     queryFn: () => purchaseOrderService.getPurchaseOrderById(id),

//     enabled: !!id,

//     staleTime: 0,
//     gcTime: 0,

//     refetchOnMount: 'always',
//     refetchOnWindowFocus: true,
//     refetchOnReconnect: true
//   });
// }

export function useCreateOpeningStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OpeningStockFormType) =>
      openingStockService.createOpeningStock(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: OPENING_STOCK_KEYS.list() });
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


export function useUpdateOpeningStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OpeningStockFormType }) =>
      openingStockService.updateOpeningStock(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: OPENING_STOCK_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: OPENING_STOCK_KEYS.details() });

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


export function useDeleteOpeningStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => openingStockService.deleteOpeningStock(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: OPENING_STOCK_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete purchase order");
    },
  });
}