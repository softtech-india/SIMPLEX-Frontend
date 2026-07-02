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
  entrytype?: string;
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

    enabled: !!params.id,
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

      if (!data.success) {
        toast.error(data.message); return;
      }
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });

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

      if (!data?.success) {
        toast.error(data?.message || "Failed to create");
        return;
      }
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });
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

      if (!data.success) {
        toast.error(data.message); return;
      }
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.details() });

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

      if (!data?.success) {
        toast.error(data?.message || "Failed to Delete");
        return;
      }
      toast.success(data?.message || "Deleted successfully");
      queryClient.invalidateQueries({ queryKey: DIRECT_SALE_KEYS.list() });

    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete direct sale");
    },
  });
}

export function usePrintSaleBill() {
  return useMutation({
    mutationFn: async (
      { id, withrate, }: { id: string | number; withrate: string; }
    ) => {
      const blob = await directSaleService.getSaleBillPrintById(id, withrate);

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