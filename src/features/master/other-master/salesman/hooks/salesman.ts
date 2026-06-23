import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesManService } from "../services/salesman";
import { SalesManFormData } from "../types/salesman";
import { toast } from "sonner";

export const SALESMAN_KEYS = {
  all: ["SalesManList"] as const,

  lists: () => [...SALESMAN_KEYS.all, "list"] as const,

  list: () => [...SALESMAN_KEYS.lists()] as const,

  details: () => [...SALESMAN_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...SALESMAN_KEYS.details(), id] as const,
};

export function useSalesMen(branchId: string | null) {
  return useQuery({
    queryKey: [...SALESMAN_KEYS.list(), branchId], // Add branchId to query key
    queryFn: () => salesManService.getAllSalesMan(branchId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // enabled: !!branchId,
  });
}

export function useSalesMan(id: number) {
  return useQuery({
    queryKey: SALESMAN_KEYS.detail(id),
    queryFn: () => salesManService.getSalesManById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,

  });
}

export function useCreateSalesMan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SalesManFormData) =>
      salesManService.createSalesMan(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: SALESMAN_KEYS.list(),
        });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create SalesMan");
      }
      return data; // Return the response data
    },

    onError: (err: Error) => {
      toast.error(err.message || String(err));
      throw err; // Re-throw to let component handle it
    },
  });
}

export function useUpdateSalesMan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: SalesManFormData;
    }) => salesManService.updateSalesMan(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: SALESMAN_KEYS.list(),
        });

        queryClient.invalidateQueries({
          queryKey: SALESMAN_KEYS.details(),
        });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update SalesMan");
      }
      return data; // Return the response data
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update SalesMan");
      throw err; // Re-throw to let component handle it
    },
  });
}

export function useDeleteSalesMan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      salesManService.deleteSalesMan(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: SALESMAN_KEYS.list(),
      });

      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete SalesMan");
    },
  });
}