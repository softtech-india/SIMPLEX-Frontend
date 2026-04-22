import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ledgerService } from '../services/ledgerService';
import { LedgerFormType } from '../types/ledger.types';
import { toast } from 'sonner';


export const LEDGER_KEYS = {
  all: ['ledgers'] as const,
  lists: () => [...LEDGER_KEYS.all, 'list'] as const,
  list: () => [...LEDGER_KEYS.lists()] as const,
  details: () => [...LEDGER_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...LEDGER_KEYS.details(), id] as const,
};

export function useLedgerList() {
  return useQuery({
    queryKey: LEDGER_KEYS.list(),
    queryFn: () => ledgerService.getAllLedgers(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useLedgerById(id: number) {
  return useQuery({
    queryKey: LEDGER_KEYS.detail(id),
    queryFn: () => ledgerService.getLedgerById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
}

export function useCreateLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LedgerFormType) =>
      ledgerService.createLedger(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create ledger");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating ledger");
    },
  });
}


export function useUpdateLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LedgerFormType }) =>
      ledgerService.updateLedger(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update ledger");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update ledger");
    },
  });
}


export function useDeleteLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ledgerService.deleteLedger(id),

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: LEDGER_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete ledger");
    },
  });
}