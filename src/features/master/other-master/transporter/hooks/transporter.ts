import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transporterService } from "../services/transporter";
import { TransporterFormData } from "../types/transporter";
import { toast } from "sonner";

export const TRANSPORTER_KEYS = {
  all: ["TransporterManList"] as const,

  lists: () => [...TRANSPORTER_KEYS.all, "list"] as const,

  list: () => [...TRANSPORTER_KEYS.lists()] as const,

  details: () => [...TRANSPORTER_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...TRANSPORTER_KEYS.details(), id] as const,
};

export function useTransporters(branchId: string | null) {
  return useQuery({
    queryKey: [...TRANSPORTER_KEYS.list(), branchId], // Add branchId to query key
    queryFn: () => transporterService.getAllTransporter(branchId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: true,
  });
}

export function useTransporter(id: number) {
  return useQuery({
    queryKey: TRANSPORTER_KEYS.detail(id),

    queryFn: () => transporterService.getTransporterById(id),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    enabled: id !== 0,
  });
}

export function useCreateTransporter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransporterFormData) =>
      transporterService.createTransporter(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: TRANSPORTER_KEYS.list(),
        });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create transporter");
      }
      return data; // Return the response data
    },

    onError: (err: Error) => {
      toast.error(err.message || String(err));
      throw err; // Re-throw to let component handle it
    },
  });
}

export function useUpdateTransporter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: TransporterFormData;
    }) => transporterService.updateTransporter(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: TRANSPORTER_KEYS.list(),
        });

        queryClient.invalidateQueries({
          queryKey: TRANSPORTER_KEYS.details(),
        });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update TRANSPORTER_KEYS");
      }
      return data; // Return the response data
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update TRANSPORTER_KEYS");
      throw err; // Re-throw to let component handle it
    },
  });
}

export function useDeleteTransporter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      transporterService.deleteTransporter(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: TRANSPORTER_KEYS.list(),
      });

      toast.success(data?.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete transporter");
    },
  });
}