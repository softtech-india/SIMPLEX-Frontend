import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { GodownTransferFormType } from "../types/godowntransfer.types";

import { toast } from "sonner";
import { godownTransferService } from "../services/godownTransferService";

export interface GetGodownTransferParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UseGodownTransferByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

// Add delete params interface
export interface DeleteGodownTransferParams {
  id: number;
  userid: number;
  compid: number;
}

export const GODOWN_TRANSFER_KEYS = {
  all: ["godown-transfer"] as const,

  lists: () =>
    [...GODOWN_TRANSFER_KEYS.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...GODOWN_TRANSFER_KEYS.lists(), params ?? {}] as const,

  details: () =>
    [...GODOWN_TRANSFER_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...GODOWN_TRANSFER_KEYS.details(), id] as const,
};

export function useGodownTransferList(
  params: GetGodownTransferParams
) {
  return useQuery({
    queryKey: GODOWN_TRANSFER_KEYS.list(params),

    queryFn: () =>
      godownTransferService.getAllGodownTransfers(
        params
      ),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useGodownTransferById(
  params: UseGodownTransferByIdParams
) {
  return useQuery({
    queryKey: GODOWN_TRANSFER_KEYS.detail(
      params.id ?? 0
    ),

    queryFn: () =>
      godownTransferService.getGodownTransferById({
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

export function useCreateGodownTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GodownTransferFormType) =>
      godownTransferService.createGodownTransfer(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: GODOWN_TRANSFER_KEYS.lists(),
        });

      } else {
        toast.error(
          data.message ||
          "Failed to create godown transfer"
        );
      }
    },

    onError: (err: Error) => {
      toast.error(
        err.message ||
        "Error creating godown transfer"
      );
    },
  });
}

export function useUpdateGodownTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: GodownTransferFormType;
    }) =>
      godownTransferService.updateGodownTransfer(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: GODOWN_TRANSFER_KEYS.lists(),
        });

        queryClient.invalidateQueries({
          queryKey: GODOWN_TRANSFER_KEYS.details(),
        });

      } else {
        toast.error(
          data.message ||
          "Failed to update godown transfer"
        );
      }
    },

    onError: (err: Error) => {
      toast.error(
        err.message ||
        "Failed to update godown transfer"
      );
    },
  });
}

export const useDeleteGodownTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userid, compid }: DeleteGodownTransferParams) =>
      godownTransferService.deleteGodownTransfer(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: GODOWN_TRANSFER_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: GODOWN_TRANSFER_KEYS.details(),
      });

      const successMessage =
        data?.message ||
        data?.data?.message ||
        "Godown transfer deleted successfully";

    },


  });
};