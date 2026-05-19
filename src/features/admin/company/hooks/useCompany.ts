import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/companyService';
import { Company, CompanyFormData } from '../types/company.types';
import { toast } from 'sonner';


export const COMPANY_KEYS = {
  all: ['companies'] as const,
  lists: () => [...COMPANY_KEYS.all, 'list'] as const,
  list: () => [...COMPANY_KEYS.lists()] as const,
  details: () => [...COMPANY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...COMPANY_KEYS.details(), id] as const,
};

export function useCompanies() {
  return useQuery({
    queryKey: COMPANY_KEYS.list(),
    queryFn: () => companyService.getAllCompanies(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: COMPANY_KEYS.detail(id),
    queryFn: () => companyService.getCompanyById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyFormData) =>
      companyService.createCompany(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create company");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating company");
    },
  });
}


export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyFormData }) =>
      companyService.updateCompany(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update company");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update company");
    },
  });
}


export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companyService.deleteCompany(id),

    onSuccess: (data : any ) => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete company");
    },
  });
}