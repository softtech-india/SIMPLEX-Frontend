import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleOrderService } from '../services/saleOrderService';
import { SaleOrderFormType } from '../types/saleOrder.types';
import { toast } from 'sonner';

export interface GetSaleOrderParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UseSaleOrderByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const SALE_ORDER_KEYS = {
  all: ["sale-order"] as const,
  lists: () => [...SALE_ORDER_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) => [...SALE_ORDER_KEYS.lists(), params ?? {}] as const,
  details: () => [...SALE_ORDER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SALE_ORDER_KEYS.details(), id] as const,
};

export function useSaleOrderList(params: GetSaleOrderParams) {
  return useQuery({
    queryKey: SALE_ORDER_KEYS.list(params),
    queryFn: () => saleOrderService.getAllSaleOrders(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useSaleOrderById(params: UseSaleOrderByIdParams) {
  return useQuery({
    queryKey: SALE_ORDER_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      saleOrderService.getSaleOrderById({
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

export function useCreateSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaleOrderFormType) =>
      saleOrderService.createSaleOrder(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: SALE_ORDER_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create sale order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating sale order");
    },
  });
}

export function useApproveSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaleOrderFormType) => saleOrderService.approveSaleOrder(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: SALE_ORDER_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to approve sale order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error while approving sale order");
    },
  });
}


export function useUpdateSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SaleOrderFormType }) =>
      saleOrderService.updateSaleOrder(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: SALE_ORDER_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: SALE_ORDER_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update sale order");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update sale order");
    },
  });
}

export function useDeleteSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: number;
      userid: number;
      compid: number;
    }) => saleOrderService.deleteSaleOrder(params),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: SALE_ORDER_KEYS.list() });
      toast.success(data?.message || "Deleted successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete sale order");
    },
  });
}

export function usePrintTbill() {
  return useMutation({
    mutationFn: async (
      { id, withrate, }: { id: number; withrate: string; }
    ) => {
      const blob = await saleOrderService.getTbillPrintById(id, withrate);

      const url = URL.createObjectURL(blob);
      const tab = window.open(url, "_blank");

      if (!tab) throw new Error("Popup blocked");

      const interval = setInterval(() => {
        try {
          if (tab.document?.readyState === "complete") {
            clearInterval(interval);

            tab.focus();

            setTimeout(() => {
              URL.revokeObjectURL(url);
            }, 2000);
          }
        } catch {
          console.warn("Waiting for PDF to load...");
        }
      }, 300);
    },

    onError: (err: any) => {
      toast.error(err?.message || "Failed to print PDF");
    },
  });
}