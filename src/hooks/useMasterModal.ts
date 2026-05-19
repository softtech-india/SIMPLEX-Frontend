import { create } from "zustand";

type State = {
  type: string | null;
  visible: boolean;
  payload?: any;
  resolve?: (data: any) => void;
};

export const useMasterModal = create<{
  modal: State;
  open: (type: State["type"], payload?: any) => Promise<any>;
  close: () => void;
  resolve: (data: any) => void;
}>((set, get) => ({
  modal: { type: null, visible: false },

  open: (type, payload) =>
    new Promise((resolve) => {
      set({
        modal: { type, visible: true, payload, resolve },
      });
    }),

  resolve: (data) => {
    get().modal.resolve?.(data);
    set({ modal: { type: null, visible: false } });
  },

  close: () => set({ modal: { type: null, visible: false } }),
}));