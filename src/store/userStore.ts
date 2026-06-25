import { create } from "zustand";
import { persist } from "zustand/middleware";


interface GlobalSearch {
  batchno: string;
}
interface UserState {
  isAuthenticated: boolean;
  userId: string;
  companyId: string;
  companyName: string;
  branchId: string;
  branchnm: string;
  finid: string;
  finstdt: string;
  finenddt: string;
  userName: string;
  userType: string;
  userSegment: string;
  pcodetag: string;

  setUserData: (data: Partial<UserState>) => void;

  globalSearch: GlobalSearch;
  setGlobalSearch: (data: Partial<GlobalSearch>) => void;

  clearUserData: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: true,
      userId: "",
      companyId: "",
      companyName: "",
      branchId: "",
      branchnm: "",
      finid: "",
      finstdt: "",
      finenddt: "",
      userName: "",
      userType: "",
      userSegment: "",
      pcodetag: "",

      globalSearch: {
        batchno: "",
      },

      setUserData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      setGlobalSearch: (data) =>
        set((state) => ({
          globalSearch: {
            ...state.globalSearch,
            ...data,
          },
        })),

      clearUserData: () =>
        set({
          isAuthenticated: false,
          userId: "",
          companyId: "",
          companyName: "",
          branchId: "",
          branchnm: "",
          finid: "",
          finstdt: "",
          finenddt: "",
          userName: "",
          userType: "",
          userSegment: "",
          pcodetag: "",
          globalSearch: {
            batchno: ""
          },
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useUserStore;