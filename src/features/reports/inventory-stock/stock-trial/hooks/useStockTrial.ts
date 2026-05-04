import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockTrialService } from '../services/stockTrialService';
import { toast } from 'sonner';
import { StockTrialParams } from '../types/stockTrial.types';



export const STOCK_TRIAL_KEYS = {
  all: ["stock-trial"] as const,

  lists: () => [...STOCK_TRIAL_KEYS.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...STOCK_TRIAL_KEYS.lists(), params ?? {}] as const,

  details: () => [...STOCK_TRIAL_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...STOCK_TRIAL_KEYS.details(), id] as const,
};

export const STOCK_LEDGER_KEYS = {
  all: ["stock-ledger"] as const,

  lists: () => [...STOCK_LEDGER_KEYS.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...STOCK_LEDGER_KEYS.lists(), params ?? {}] as const,

  details: () => [...STOCK_LEDGER_KEYS.all, "detail"] as const,

  detail: (id: number) =>
    [...STOCK_LEDGER_KEYS.details(), id] as const,
};

export function useStockTrialList(params: StockTrialParams) {
  return useQuery({
    queryKey: STOCK_TRIAL_KEYS.list(params),

    queryFn: () =>
      stockTrialService.getAllStockTrials(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}



export function useStockTrialDetails(params: StockTrialParams & { productid: number }) {
  return useQuery({
    queryKey: [...STOCK_TRIAL_KEYS.list(params), 'details', params.productid],
    queryFn: () => stockTrialService.getAllBrands(),
    staleTime: 0,
    gcTime: 0,
    enabled: false, // Don't fetch automatically
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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

export function useStockledger(params: StockLedgerParams) {
  return useQuery({
    queryKey: [...STOCK_LEDGER_KEYS.list(params), 'details', params.productid],
    queryFn: () => stockTrialService.getAllStockLedgers(params),
    staleTime: 0,
    gcTime: 0,
    enabled: false, // Don't fetch automatically
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

