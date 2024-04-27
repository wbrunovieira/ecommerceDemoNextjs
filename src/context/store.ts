import create from 'zustand';

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
}

interface CartState {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (product: Product) =>
    set((state: CartState) => ({
      cartItems: [...state.cartItems, product],
    })),
  removeFromCart: (productId: string) =>
    set((state: CartState) => ({
      cartItems: state.cartItems.filter(
        (item: Product) => item.id !== productId
      ),
    })),
  clearCart: () => set({ cartItems: [] }),
}));
