import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryChallanService } from "../services/deliveryChallanService";
import { DeliveryChallanFormType } from "../types/deliveryChallan.types";
import { toast } from "sonner";

export interface GetDeliveryChallanParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type UseDeliveryChallanByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const DELIVERY_CHALLAN_KEYS = {
  all: ["delivery-challan"] as const,
  lists: () => [...DELIVERY_CHALLAN_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...DELIVERY_CHALLAN_KEYS.lists(), params ?? {}] as const,
  details: () => [...DELIVERY_CHALLAN_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DELIVERY_CHALLAN_KEYS.details(), id] as const,
};

export function useDeliveryChallan(params: GetDeliveryChallanParams) {
  return useQuery({
    queryKey: DELIVERY_CHALLAN_KEYS.list(params),

    queryFn: () =>
      deliveryChallanService.getAllDeliveryChallans(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useDeliveryChallanById(
  params: UseDeliveryChallanByIdParams
) {
  return useQuery({
    queryKey: DELIVERY_CHALLAN_KEYS.detail(params.id ?? 0),

    queryFn: () =>
      deliveryChallanService.getDeliveryChallanById({
        id: params.id!,
        userid: params.userid,
        compid: params.compid,
        branchid: params.branchid,
        finid: params.finid,
      }),

    enabled: !!params.id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateDeliveryChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeliveryChallanFormType) =>
      deliveryChallanService.createDeliveryChallan(data),

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHALLAN_KEYS.lists(),
      });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating Delivery Challan");
    },
  });
}

export function useUpdateDeliveryChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: DeliveryChallanFormType;
    }) =>
      deliveryChallanService.updateDeliveryChallan(id, data),

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Failed to update Delivery Challan");
        return;
      }

      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHALLAN_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHALLAN_KEYS.details(),
      });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update Delivery Challan");
    },
  });
}

export function useDeleteDeliveryChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: number;
      userid: number;
      compid: number;
    }) =>
      deliveryChallanService.deleteDeliveryChallan(params),

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Failed to delete Delivery Challan");
        return;
      }

      toast.success(data.message || "Deleted successfully");

      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHALLAN_KEYS.lists(),
      });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete Delivery Challan");
    },
  });
}