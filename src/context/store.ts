import { create } from "zustand";
import { persist, PersistOptions, createJSONStorage } from "zustand/middleware";

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
  cartFavorited: Product[];
  favorites: string[];
  addToFavorite: (product: Product) => void;
  removeFromFavorite: (productId: string) => void;
  clearFavorite: () => void;

  toggleFavorite: (productId: string) => void;
}

interface SelectionState {
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedColor: string | null;

  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedBrand: (brandId: string | null) => void;
  setSelectedColor: (colorId: string | null) => void;
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
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);
export const useFavoritesStore = create(
  persist(
    (set) => ({
      cartFavorited: [],
      favorites: [],

      addToFavorite: (product: Product) =>
        set((state: FavoriteState) => {
          const index = state.cartFavorited.findIndex(
            (item) => item.id === product.id
          );

          if (index !== -1) {
            let newFavoritedItems = [...state.cartFavorited];
            newFavoritedItems[index] = {
              ...newFavoritedItems[index],
              quantity: newFavoritedItems[index].quantity + product.quantity,
            };
            return { cartFavorited: newFavoritedItems };
          }

          return { cartFavorited: [...state.cartFavorited, product] };
        }),

      toggleFavorite: (productId: string) =>
        set((state: any) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id: string) => id !== productId)
            : [...state.favorites, productId],
        })),
      removeFromFavorite: (productId: string) =>
        set((state: FavoriteState) => ({
          cartItems: state.cartFavorited.filter(
            (item) => item.id !== productId
          ),
        })),
      clearFavorite: () => set({ cartItems: [] }),
    }),
    {
      name: "favorite-storage",
      getStorage: () => localStorage,
    }
  )
);

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      selectedCategory: null,
      selectedBrand: null,
      selectedColor: null,

      setSelectedCategory: (categoryId: string | null) =>
        set({ selectedCategory: categoryId }),
      
      setSelectedColor: (colorId: string | null) =>
        set({ selectedColor: colorId }),
      
      setSelectedBrand: (brandId: string | null) =>
        set({ selectedBrand: brandId }),

    }),
    {
      name: "selection-storage",
      getStorage: () => localStorage,
    } as PersistOptions<SelectionState>
  )
);

// export const useFavoritesStore = create<FavoriteState>((set) => ({
//   favorites: [],
//   toggleFavorite: (productId) =>
//     set((state) => ({
//       favorites: state.favorites.includes(productId)
//         ? state.favorites.filter((id) => id !== productId)
//         : [...state.favorites, productId],
//     })),
// }));
