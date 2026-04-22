// store/useReportStore.ts
import { create } from "zustand";

interface GstOutputRegCriteria {
    startDate?: Date;
    endDate?: Date;
    format?: string;
    itc?: string;
    rcm?: string;
    sortby?: string;
    gstr1criteria?: string;
    selectedTrantypes?: [];
    selectedPartytypes?: [];
    selectedPartyIds?: [];
}

interface ReportState {
    gstoutputregCriteria: GstOutputRegCriteria;

    setGstOutputRegCriteria: (criteria: Partial<GstOutputRegCriteria>) => void;

    resetGstOutputRegCriteria: () => void; // ✅ new function
}

const useReportStore = create<ReportState>((set) => ({
    gstoutputregCriteria: {},

    setGstOutputRegCriteria: (criteria) =>
        set((state) => ({ gstoutputregCriteria: { ...state.gstoutputregCriteria, ...criteria } })),

    resetGstOutputRegCriteria: () => set({ gstoutputregCriteria: {} }), // ✅ reset to initial state
}));

export default useReportStore;
