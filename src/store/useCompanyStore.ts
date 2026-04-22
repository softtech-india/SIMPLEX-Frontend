import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
  companyId: string;
  branchId: string;
  financialYearId: string;
  companyName: string;
  branchName: string;
  financialYearName: string;
  finYearStartDate: string;
  finYearEndDate: string;
  setCompanyData: (data: Partial<CompanyState>) => void;
  clearCompanyData: () => void;
}

const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companyId: "",
      branchId: "",
      financialYearId: "",
      companyName: "",
      branchName: "",
      financialYearName: "",
      finYearStartDate: "",
      finYearEndDate: "",

      setCompanyData: (data) =>
        set((state) => ({
          ...state,
          ...data, // merge new data
        })),

      clearCompanyData: () =>
        set({
          companyId: "",
          branchId: "",
          financialYearId: "",
          companyName: "",
          branchName: "",
          financialYearName: "",
          finYearStartDate: "",
          finYearEndDate: "",
        }),
    }),
    {
      name: "company-storage", // stored in localStorage
    }
  )
);

export default useCompanyStore;
