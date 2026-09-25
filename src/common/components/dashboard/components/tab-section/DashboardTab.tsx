'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import useUserStore from '@/store/userStore';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ProductSearchItem } from '@/api/master/product-api';
import { StockLedgersModal } from '@/features/reports/inventory-stock/stock-trial/components/StockLedgerModal';
import { StockTrial } from '@/features/reports/inventory-stock/stock-trial/types/stockTrial.types';
import { GoodReceivedNoteForm } from '@/features/purchase/good-received-note/components/GoodReceivedNoteForm';
import { DirectSaleForm } from '@/features/sale/direct-sale/components/DirectSaleForm';
import { PlusIcon, SearchIcon } from 'lucide-react';


export default function DashboardTab() {
  const { userId, companyId, branchId, branchnm } = useUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 350);

  const { data: searchResults = [], isFetching: isSearching } = useProductSearch({
    userId,
    companyId,
    searchText: debouncedSearchTerm,
  });

  useEffect(() => {
    setIsDropdownOpen(debouncedSearchTerm.trim().length > 0);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---- Stock ledger modal ----
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockTrial | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const handleSelectProduct = useCallback((product: ProductSearchItem) => {
    setSelectedProduct({
      productid: product.id,
      productnm: product.productname,
      productcode: product.productcode,
      unit: product.unit,
    } as StockTrial);
    setIsLedgerModalOpen(true);
    setIsDropdownOpen(false);
    setSearchTerm('');
  }, []);

  const handleLedgerModalClose = useCallback(() => {
    setIsLedgerModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // ---- Quick action modals ----
  const [isGrnModalOpen, setIsGrnModalOpen] = useState(false);
  const [isDirectSaleModalOpen, setIsDirectSaleModalOpen] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-1 p-1 bg-slate-50 min-h-screen">
      {/* search + quick actions */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div ref={searchWrapperRef} className="relative w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setIsDropdownOpen(true);
            }}
            placeholder="Search products by name..."
            aria-label="Search products"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}

          {isDropdownOpen && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {searchResults.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto">
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5 last:border-b-0 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{product.productname}</p>
                        <p className="text-xs text-gray-500">{product.productcode}</p>
                      </div>
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                !isSearching && <p className="px-4 py-3 text-sm text-gray-500">No products found.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-xs text-gray-400 sm:inline">{todayFormatted}</span>
          <button
            onClick={() => setIsGrnModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4" />
            New GRN
          </button>
          <button
            onClick={() => setIsDirectSaleModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            New sale
          </button>
        </div>
      </div>

      {/* Stock Ledger */}
      <StockLedgersModal
        visible={isLedgerModalOpen}
        onClose={handleLedgerModalClose}
        selectedRow={selectedProduct}
        branchId={Number(branchId)}
        branchName={branchnm || ''}
        startDate={today}
        endDate={today}
        godownIds=""
      />

      {/* Quick action */}
      {isGrnModalOpen && (
        <GoodReceivedNoteForm
          visible={isGrnModalOpen}
          onClose={() => setIsGrnModalOpen(false)}
          formGoodReceivedNoteId={0}
          formSelectedBranch={branchnm || ''}
          toolbarBranchId={Number(branchId)}
          mode={'Add'}
          isRowConfirmed={false}
          onUpdated={() => {
            setIsGrnModalOpen(false);
          }}
        />
      )}

      {isDirectSaleModalOpen && (
        <DirectSaleForm
          visible={isDirectSaleModalOpen}
          onClose={() => setIsDirectSaleModalOpen(false)}
          formDirectSaleId={0}
          formSelectedBranch={branchnm || ''}
          toolbarBranchId={Number(branchId)}
          mode={'Add'}
          onUpdated={() => {
            setIsDirectSaleModalOpen(false);
          }}
        />
      )}
    </div>
  );
}