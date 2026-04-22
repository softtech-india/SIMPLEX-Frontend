import { calculateDateRange } from "@/common/components/DatePeriodPicker/dateUtils";
import { DatePeriod } from "@/common/components/DatePeriodPicker/types";
import { create } from "zustand";

const getFirstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};


interface SaleRegCriteria {
  period: DatePeriod;
  startdt: Date;
  enddt: Date;
  filterorderType?: string;
  prodCode?: string;
  status: string;
}

interface PurRegCriteria {
  startDate?: Date;
  endDate?: Date;
  prodCode?: string;
  reporttype?: string;
}

interface GpReportCriteria {
  startDate?: Date;
  endDate?: Date;
  summarytag?: string;
  gplogictag?: string;
  roilogictag?: string;
  monthNo?: number;
}

interface StockTrialCriteria {
  startDate?: Date;
  endDate?: Date;
  printrtval?: string;
  balancetag?: string;
  reporttype?: string;
  selectedBrandIds?: [];
  selectedClassIds?: [];
  selectedGroupIds?: [];
}

interface DealerLedgerCriteria {
  period: DatePeriod;
  startdt: Date;
  enddt: Date;
  reqNarrationTags?: string;
  brandwiseTag?: string;
  pdcTag?: string;
  selectedBrandId?: number | null;
  selectedBrandName?: string | null;
}

const defaultDealerLedgerRange = calculateDateRange("financial_year");

const defaultDealerLedgerCriteria: DealerLedgerCriteria = {
  period: "financial_year",
  startdt: defaultDealerLedgerRange.fromDate,
  enddt: defaultDealerLedgerRange.toDate,
  reqNarrationTags: "N",
  brandwiseTag: "Y",
  pdcTag: "N",
  selectedBrandId: 0,
};

const defaultSaleReg = calculateDateRange("this_quarter");

const defaultSaleRegCriteria: SaleRegCriteria = {
  period: "this_quarter",
  startdt: defaultSaleReg.fromDate,
  enddt: defaultSaleReg.toDate,
  status: 'U'
};

interface PriceListCriteria {
  startDate?: Date;
  endDate?: Date;
  selectedBrandId?: number | null;
  selectedSegmentId?: number | null;
  selectedProductGroupId?: number | null;
  selectedProductClassId?: number | null;
  selectedProductModelId?: number | null;
  selectedModelName?: string | null;
}

interface DealerOutStandingCriteria {
  period?: DatePeriod;
  startdt?: Date;
  enddt?: Date;
  selectedBrandId?: number | null;
  selectedBrandName?: string | null;
}
interface ClosingStockCriteria {
  selectedBrandId?: number | null;
  selectedClassId?: number | null;
  selectedGroupId?: number | null;
}

interface StockStatusCriteria {
  selectedBrandId?: number | null;
  selectedGroupId?: string | number | null;
  selectedProductClassId?: number | null;
  selectedModelId?: number | null;

}

interface SoStatusCriteria {
  enddt?: Date;
  // selectedBrandId?: number | null;
  orderstatus?: string;
}

interface ReportState {
  saleRegCriteria: SaleRegCriteria;
  purRegCriteria: PurRegCriteria;
  gpReportCriteria: GpReportCriteria;
  stocktrialCriteria: StockTrialCriteria;
  dealerledgerCriteria: DealerLedgerCriteria;

  pricelistCriteria: PriceListCriteria;
  dealeroutstandingDetailsCriteria: DealerOutStandingCriteria;
  stockstatusCriteria: StockStatusCriteria;
  sostatusCriteria: SoStatusCriteria;

  closingstockCriteria: ClosingStockCriteria;

  setSaleRegCriteria: (criteria: Partial<SaleRegCriteria>) => void;
  setPurReg: (criteria: Partial<PurRegCriteria>) => void;
  setGpReport: (criteria: Partial<GpReportCriteria>) => void;
  setStockTrialCriteria: (criteria: Partial<StockTrialCriteria>) => void;
  setDealerLedgerCriteria: (criteria: Partial<DealerLedgerCriteria>) => void;
  setPriceListCriteria: (criteria: Partial<PriceListCriteria>) => void;
  setDealerOutstandingDetailsCriteria: (criteria: Partial<DealerOutStandingCriteria>) => void;
  setStockStatusCriteria: (criteria: Partial<StockStatusCriteria>) => void;
  setSoStatusCriteria: (criteria: Partial<SoStatusCriteria>) => void;

  setClosingStockCriteria: (criteria: Partial<ClosingStockCriteria>) => void;
  resetSaleRegCriteria: () => void;
  resetGpReportCriteria: () => void;
  resetStockTrialCriteria: () => void;
  resetDealerLedgerCriteria: () => void;
  resetPriceListCriteria: () => void;
  resetDealerOutstandingDetailsCriteria: () => void;
  resetStockStatusCriteria: () => void;
  resetSoStatusCriteria: () => void;
  resetClosingStockCriteria: () => void;
}

const useReportStore = create<ReportState>((set) => ({
  saleRegCriteria: defaultSaleRegCriteria,
  purRegCriteria: {},
  gpReportCriteria: {},
  stocktrialCriteria: {},
  dealerledgerCriteria: defaultDealerLedgerCriteria,
  closingstockCriteria: {},
  dealeroutstandingDetailsCriteria: {},
  pricelistCriteria: {},
  stockstatusCriteria: {},
  sostatusCriteria: {},

  setSaleRegCriteria: (criteria) =>
    set((state) => ({
      saleRegCriteria: { ...state.saleRegCriteria, ...criteria },
    })),

  setPurReg: (criteria) =>
    set((state) => ({
      purRegCriteria: { ...state.purRegCriteria, ...criteria },
    })),

  setGpReport: (criteria) =>
    set((state) => ({
      gpReportCriteria: { ...state.gpReportCriteria, ...criteria },
    })),

  setStockTrialCriteria: (criteria) =>
    set((state) => ({
      stocktrialCriteria: { ...state.stocktrialCriteria, ...criteria },
    })),

  setDealerOutstandingDetailsCriteria: (criteria) =>
    set((state) => ({
      dealeroutstandingDetailsCriteria: { ...state.dealeroutstandingDetailsCriteria, ...criteria },
    })),

  setClosingStockCriteria: (criteria) =>
    set((state) => ({
      closingstockCriteria: { ...state.closingstockCriteria, ...criteria },
    })),
  setDealerLedgerCriteria: (criteria) =>
    set((state) => ({
      dealerledgerCriteria: { ...state.dealerledgerCriteria, ...criteria },
    })),

  setPriceListCriteria: (criteria) =>
    set((state) => ({
      pricelistCriteria: { ...state.pricelistCriteria, ...criteria },
    })),

  setStockStatusCriteria: (criteria) =>
    set((state) => ({
      stockstatusCriteria: { ...state.stockstatusCriteria, ...criteria },
    })),
  setSoStatusCriteria: (criteria) =>
    set((state) => ({
      sostatusCriteria: { ...state.sostatusCriteria, ...criteria },
    })),

  //  reset to initial state
  resetSaleRegCriteria: () => set({ saleRegCriteria: defaultSaleRegCriteria }),
  resetGpReportCriteria: () => set({ gpReportCriteria: {} }),
  resetStockTrialCriteria: () => set({ stocktrialCriteria: {} }),
  resetDealerLedgerCriteria: () => set({ dealerledgerCriteria: defaultDealerLedgerCriteria }),
  resetPriceListCriteria: () => set({ pricelistCriteria: {} }),
  resetDealerOutstandingDetailsCriteria: () => set({ dealeroutstandingDetailsCriteria: {} }),
  resetStockStatusCriteria: () => set({ stockstatusCriteria: {} }),
  resetSoStatusCriteria: () => set({ sostatusCriteria: {} }),
  resetClosingStockCriteria: () => set({ closingstockCriteria: {} }),
}));

export default useReportStore;
