import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: number;
  name: string;
  dealersalrerate: number;
  qty: number;
  isAskingPrice: boolean;
  askingPrice: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleAskingPrice: (id: number, checked: boolean) => void;
  updateAskingPrice: (id: number, value: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product) => {
        const items = get().cartItems;
        const found = items.find((i) => i.id === product.id);

        if (found) {
          set({
            cartItems: items.map((i) =>
              i.id === product.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({
            cartItems: [
              ...items,
              { id: product.id, name: product.name, dealersalrerate: product.dealersalrerate, qty: 1, isAskingPrice: false, askingPrice: "", },
            ],
          });
        }
      },

      increaseQty: (id) =>
        set({
          cartItems: get().cartItems.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        }),

      decreaseQty: (id) =>
        set({
          cartItems: get().cartItems
            .map((i) =>
              i.id === id ? { ...i, qty: i.qty - 1 } : i
            )
            .filter((i) => i.qty > 0),
        }),

      removeFromCart: (id) =>
        set({
          cartItems: get().cartItems.filter((i) => i.id !== id),
        }),

      clearCart: () => set({ cartItems: [] }),

      toggleAskingPrice: (id, checked) =>
        set({
          cartItems: get().cartItems.map((i) =>
            i.id === id ? { ...i, isAskingPrice: checked, askingPrice: checked ? i.askingPrice : "" } : i
          ),
        }),

      updateAskingPrice: (id, value) =>
        set({
          cartItems: get().cartItems.map((i) =>
            i.id === id ? { ...i, askingPrice: value } : i
          ),
        }),

    }),
    {
      name: "order-cart-storage", // 👈 localStorage key
    }
  )
);
