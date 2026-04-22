// store/useReportStore.ts
import { create } from "zustand";

interface PurchaseRegCriteria {
    startDate?: Date;
    endDate?: Date;
    billType?: string;
    sortby?: string;
    reportType?: string;
}

interface ReportState {
    purchaseRegCriteria: PurchaseRegCriteria;

    setPurchaseRegCriteria: (criteria: Partial<PurchaseRegCriteria>) => void;

    resetPurchaseRegCriteria: () => void; // ✅ new function
}

const useReportStore = create<ReportState>((set) => ({
    purchaseRegCriteria: {},

    setPurchaseRegCriteria: (criteria) =>
        set((state) => ({ purchaseRegCriteria: { ...state.purchaseRegCriteria, ...criteria } })),

    resetPurchaseRegCriteria: () => set({ purchaseRegCriteria: {} }), // ✅ reset to initial state
}));

export default useReportStore;
