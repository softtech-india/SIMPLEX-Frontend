// store/useReportStore.ts
import { create } from "zustand";

interface SaleRegCriteria {
    startDate?: Date;
    endDate?: Date;
    billType?: string;
    sortby?: string;
    reportType?: string;
}

interface ReportState {
    saleRegCriteria: SaleRegCriteria;

    setSaleRegCriteria: (criteria: Partial<SaleRegCriteria>) => void;

    resetSaleRegCriteria: () => void; // ✅ new function
}

const useReportStore = create<ReportState>((set) => ({
    saleRegCriteria: {},

    setSaleRegCriteria: (criteria) =>
        set((state) => ({ saleRegCriteria: { ...state.saleRegCriteria, ...criteria } })),

    resetSaleRegCriteria: () => set({ saleRegCriteria: {} }), // ✅ reset to initial state
}));

export default useReportStore;
