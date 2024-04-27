import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  title: string;
  quantity: number;
  image: string;
  price: number;
}

interface CartState {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, amount: number) => void;
}

export const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (product: Product) =>
        set((state: CartState) => {
          const index = state.cartItems.findIndex(
            (item) => item.id === product.id
          );

          if (index !== -1) {
            let newCartItems = [...state.cartItems];
            newCartItems[index] = {
              ...newCartItems[index],
              quantity: newCartItems[index].quantity + product.quantity,
            };
            return { cartItems: newCartItems };
          }

          return { cartItems: [...state.cartItems, product] };
        }),
      removeFromCart: (productId: string) =>
        set((state: CartState) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        })),
      clearCart: () => set({ cartItems: [] }),
      updateQuantity: (productId: string, amount: number) =>
        set((state: CartState) => {
          const index = state.cartItems.findIndex(
            (item) => item.id === productId
          );

          if (index !== -1) {
            let newQuantity = state.cartItems[index].quantity + amount;
            if (newQuantity <= 0) {
              return {
                cartItems: state.cartItems.filter(
                  (item) => item.id !== productId
                ),
              };
            } else {
              let newCartItems = [...state.cartItems];
              newCartItems[index] = {
                ...newCartItems[index],
                quantity: newQuantity,
              };
              return { cartItems: newCartItems };
            }
          }
          return {}; // Não altera nada se o produto não for encontrado
        }),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);
