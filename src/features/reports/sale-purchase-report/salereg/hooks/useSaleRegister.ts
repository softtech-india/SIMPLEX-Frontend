import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleRegisterService } from '../services/saleRegister.service';
import { toast } from 'sonner';
import { SaleRegisterParams } from '../types/saleRegister.type';



export const SALE_REGISTER_KEYS = {
  all: ["sale-register"] as const,
  lists: () => [...SALE_REGISTER_KEYS.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...SALE_REGISTER_KEYS.lists(), params ?? {}] as const,
  details: () => [...SALE_REGISTER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SALE_REGISTER_KEYS.details(), id] as const,
};

export function useSaleRegisterList(params: SaleRegisterParams & { withProduct?: number }) {
  return useQuery({
    queryKey: SALE_REGISTER_KEYS.list(params),

    queryFn: () => {
      // Check if withProduct is 1 (Yes)
      if (params.withProduct === 1) {
        return saleRegisterService.getAllSaleRegistersWithProd(params);
      }
      // Default to regular sale register
      return saleRegisterService.getAllSaleRegisters(params);
    },

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}


export interface StockLedgerParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  productid: number;
  strgodown: string;
}
