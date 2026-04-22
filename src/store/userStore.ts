import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  companyId: string;
  userId: string;
  branchId: string;
  userName: string;
  userType: string;
  userSegment: string;

  setUserData: (data: Partial<UserState>) => void;
  clearUserData: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      companyId: "",
      userId: "",
      branchId: "",
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
          companyId: "",
          userId: "",
          branchId: "",
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