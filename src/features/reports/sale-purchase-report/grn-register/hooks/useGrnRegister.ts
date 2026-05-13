import { useQuery } from '@tanstack/react-query';
import { grnService } from '../services/grnRegisterService.service';
import { GRNParams } from '../types/grnRegister.type';

export const GRN_KEYS = {
  all: ["grn"] as const,
  lists: () => [...GRN_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...GRN_KEYS.lists(), params ?? {}] as const,
};

export function useGRNList(params: GRNParams) {
  return useQuery({
    queryKey: GRN_KEYS.list(params),
    queryFn: () => grnService.getAllGRNs(params),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useGRNBrands() {
  return useQuery({
    queryKey: ["grn-brands"],
    queryFn: () => grnService.getAllBrands(),
    staleTime: 0,
  });
}

export function useGRNClasses() {
  return useQuery({
    queryKey: ["grn-classes"],
    queryFn: () => grnService.getAllClasses(),
    staleTime: 0,
  });
}

export function useGRNVendors(userid: number, compid: number) {
  return useQuery({
    queryKey: ["grn-vendors", userid, compid],
    queryFn: () => grnService.getAllVendors(userid, compid),
    staleTime: 0,
    enabled: !!userid && !!compid,
  });
}

export function useGRNStates() {
  return useQuery({
    queryKey: ["grn-states"],
    queryFn: () => grnService.getAllStates(),
    staleTime: 0,
  });
}