import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { compFinyearMapping } from '../services/CompFinyearMappingService';
import { CompFinyearMappingState, Company, CreateMappingInput } from '../types/compFinyearMapping.types';
import { toast } from 'sonner';

export const COMP_FINYEAR_KEYS = {
  all: ['comp-finyear-mapping'] as const,
  company: () => [...COMP_FINYEAR_KEYS.all, 'company'] as const,
  mapping: (companyId: number | null) =>[...COMP_FINYEAR_KEYS.all, 'mapping', companyId] as const,
};


export function useCompanies() {
  return useQuery<Company[]>({
    queryKey: COMP_FINYEAR_KEYS.company(),
    queryFn: () => compFinyearMapping.getAllCompany(),

    staleTime: 0,
    gcTime: 0,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCompFinyearMapping(companyId: number | null) {
  return useQuery<CompFinyearMappingState>({
    queryKey: COMP_FINYEAR_KEYS.mapping(companyId),
    queryFn: () => compFinyearMapping.getAllMapUnmappData(companyId!),

    enabled: !!companyId,

    staleTime: 0,
    gcTime: 0,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateCompFinyearMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, finid }: CreateMappingInput) =>
      compFinyearMapping.createCompFinyearMapping(companyId , finid),

    onSuccess: (response: any, variables: CreateMappingInput) => {
      if (response?.success) {
        toast.success(response.message || "Mapped successfully");
      } else {
        toast.error(response?.message || "Mapping failed");
      }
      queryClient.invalidateQueries({ queryKey: COMP_FINYEAR_KEYS.mapping(variables.companyId), });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to create mapping");
    },
  });
}