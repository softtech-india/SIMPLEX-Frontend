import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderContext {
  brandId: number | null;
  brandName: string;
  salesmanName: string;
  salesmanId: number;
  setOrderContext: (data: Partial<OrderContext>) => void;
  clearOrderContext: () => void;
}

export const useOrderContextStore = create<OrderContext>()(
  persist(
    (set) => ({
      brandId: null,
      brandName: "",
      salesmanName: "",
      salesmanId: 0,

      setOrderContext: (data) =>
        set((state) => ({ ...state, ...data })),

      clearOrderContext: () => set({
        brandId: null,
        brandName: "",
        salesmanName: "",
        salesmanId: 0,
      }),
    }),
    {
      name: "order-context-storage"
    }
  )
);
