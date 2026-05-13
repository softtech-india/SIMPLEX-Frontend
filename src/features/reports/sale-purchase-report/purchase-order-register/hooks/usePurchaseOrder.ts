import { useQuery } from '@tanstack/react-query';
import { purchaseOrderService } from '../services/purchaseOrderService.service';
import { PurchaseOrderParams } from '../types/purchaseOrder.type';

export const PURCHASE_ORDER_KEYS = {
  all: ["purchase-order"] as const,
  lists: () => [...PURCHASE_ORDER_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...PURCHASE_ORDER_KEYS.lists(), params ?? {}] as const,
};

export function usePurchaseOrderList(params: PurchaseOrderParams) {
  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.list(params),
    queryFn: () => purchaseOrderService.getAllPurchaseOrders(params),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => purchaseOrderService.getAllBrands(),
    staleTime: 0,
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: () => purchaseOrderService.getAllClasses(),
    staleTime: 0,
  });
}

export function useSubClasses() {
  return useQuery({
    queryKey: ["subclasses"],
    queryFn: () => purchaseOrderService.getAllSubClasses(),
    staleTime: 0,
  });
}

export function useVendors(userid: number, compid: number) {
  return useQuery({
    queryKey: ["vendors", userid, compid],
    queryFn: () => purchaseOrderService.getAllVendors(userid, compid),
    staleTime: 0,
    enabled: !!userid && !!compid,
  });
}

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => purchaseOrderService.getAllStates(),
    staleTime: 0,
  });
}