import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string;
  companyId: string;
  branchId: string;
  finid: string;
  userName: string;
  userType: string;
  userSegment: string;

  setUserData: (data: Partial<UserState>) => void;
  clearUserData: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: "",
      companyId: "",
      branchId: "",
      finid: "",
      userName: "",
      userType: "",
      userSegment: "",

      setUserData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      clearUserData: () =>
        set({
          userId: "",
          companyId: "",
          branchId: "",
          finid: "",
          userName: "",
          userType: "",
          userSegment: "",
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useUserStore;