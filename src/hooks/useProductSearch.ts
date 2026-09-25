import { useQuery } from '@tanstack/react-query';
import { searchProducts, ProductSearchItem } from '@/api/master/product-api';

interface UseProductSearchParams {
  userId: number | string;
  companyId: number | string;
  searchText: string;
}

export function useProductSearch({ userId, companyId, searchText }: UseProductSearchParams) {
  const trimmed = searchText.trim();

  return useQuery<ProductSearchItem[]>({
    queryKey: ['product-search', userId, companyId, trimmed],
    queryFn: () => searchProducts(userId, companyId, trimmed),
    enabled: trimmed.length > 0,
    staleTime: 30_000,
    placeholderData: (previousData) => previousData, // keep last results visible while the new query loads
  });
}