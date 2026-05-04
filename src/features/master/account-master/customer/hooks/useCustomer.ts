import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { CustomerFormData } from '../types/customer.types';
import { toast } from 'sonner';


export const CUSTOMER_KEYS = {
  all: ['customers'] as const,
  lists: () => [...CUSTOMER_KEYS.all, 'list'] as const,
  list: () => [...CUSTOMER_KEYS.lists()] as const,
  details: () => [...CUSTOMER_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CUSTOMER_KEYS.details(), id] as const,
};

export function useCustomerList() {
  return useQuery({
    queryKey: CUSTOMER_KEYS.list(),
    queryFn: () => customerService.getAllCustomer(),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCustomerById(id: number) {
  return useQuery({
    queryKey: CUSTOMER_KEYS.detail(id),
    queryFn: () => customerService.getCustomerById(id),

    enabled: !!id,

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) =>
      customerService.createCustomer(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create customer");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating customer");
    },
  });
}


export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerFormData }) =>
      customerService.updateCustomer(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.list() });
        queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.details() });

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


export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => customerService.deleteCustomer(id),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.list() });
      toast.success(data.message);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete Customer");
    },
  });
}