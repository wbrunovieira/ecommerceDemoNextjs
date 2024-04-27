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

interface FavoriteState {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
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
          return {};
        }),
    }),

    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export const useFavoritesStore = create<FavoriteState>((set) => ({
  favorites: [],
  toggleFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId],
    })),
}));
