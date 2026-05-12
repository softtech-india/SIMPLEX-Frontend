//sales-order-register/hooks/useSalesOrder.ts
import { useQuery } from '@tanstack/react-query';
import { salesOrderService } from '../services/salesOrderService.service';
import { SalesOrderParams } from '../types/salesOrder.type';

export const SALES_ORDER_KEYS = {
  all: ["sales-order"] as const,
  lists: () => [...SALES_ORDER_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...SALES_ORDER_KEYS.lists(), params ?? {}] as const,
};

export function useSalesOrderList(params: SalesOrderParams) {
  return useQuery({
    queryKey: SALES_ORDER_KEYS.list(params),
    queryFn: () => salesOrderService.getAllSalesOrders(params),
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
    queryFn: () => salesOrderService.getAllBrands(),
    staleTime: 0,
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: () => salesOrderService.getAllClasses(),
    staleTime: 0,
  });
}

export function useSubClasses() {
  return useQuery({
    queryKey: ["subclasses"],
    queryFn: () => salesOrderService.getAllSubClasses(),
    staleTime: 0,
  });
}

export function useCustomers(userid: number, compid: number) {
  return useQuery({
    queryKey: ["customers", userid, compid],
    queryFn: () => salesOrderService.getAllCustomers(userid, compid),
    staleTime: 0,
    enabled: !!userid && !!compid,
  });
}

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => salesOrderService.getAllStates(),
    staleTime: 0,
  });
}