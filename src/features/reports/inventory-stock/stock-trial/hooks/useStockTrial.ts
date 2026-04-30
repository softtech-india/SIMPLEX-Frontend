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


