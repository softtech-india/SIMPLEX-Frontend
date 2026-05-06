import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;

  setCompanyData: (data: Partial<CompanyState>) => void;
  clearCompanyData: () => void;
}

const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companyId: "",
      companyName: "",
      branchId: "",
      branchName: "",

      setCompanyData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      clearCompanyData: () =>
        set({
          companyId: "",
          companyName: "",
          branchId: "",
          branchName: "",
        }),
    }),
    {
      name: "company-storage",
    }
  )
);

export default useCompanyStore;
