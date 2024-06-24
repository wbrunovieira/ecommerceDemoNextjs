import create, { StateCreator } from "zustand";
import { persist, PersistOptions, createJSONStorage } from "zustand/middleware";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  height: number;
  width: number;
  length: number;
  weight: number;
}

interface CartState {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, amount: number) => void;
  initializeCart: (products: Product[]) => void;
}

interface FavoriteState {
  cartFavorited: Product[];
  favorites: string[];
  addToFavorite: (product: Product) => void;
  removeFromFavorite: (productId: string) => void;
  clearFavorite: () => void;

  toggleFavorite: (productId: string) => void;
}

export interface SelectionState {
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
  selectedMaterial: string | null;
  selectedMinPrice: number | null;
  selectedMaxPrice: number | null;

  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedBrand: (brandId: string | null) => void;
  setSelectedMaterial: (materialId: string | null) => void;
  setSelectedColor: (colorId: string | null) => void;
  setSelectedSize: (sizeId: string | null) => void;
  setSelectedMinPrice: (selectedMinPrice: number | null) => void;
  setSelectedMaxPrice: (selectedMaxPrice: number | null) => void;
}

type MyPersist = (
  config: StateCreator<CartState>,
  options: PersistOptions<CartState>
) => StateCreator<CartState>;

export const useCartStore = create<CartState>(
  (persist as MyPersist)(
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
      initializeCart: (products: Product[]) => set({ cartItems: products }),
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
        set((state: FavoriteState) => {
          const updatedCartFavorited = state.cartFavorited.filter(
            (item) => item.id !== productId
          );
          return { cartFavorited: updatedCartFavorited };
        }),

      clearFavorite: () => set({ cartFavorited: [] }),
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
      selectedMaterial: null,
      selectedColor: null,
      selectedSize: null,
      selectedMinPrice: null,
      selectedMaxPrice: null,

      setSelectedCategory: (categoryId: string | null) =>
        set({ selectedCategory: categoryId }),

      setSelectedBrand: (brandId: string | null) =>
        set({ selectedBrand: brandId }),

      setSelectedMaterial: (materialId: string | null) =>
        set({ selectedMaterial: materialId }),

      setSelectedColor: (colorId: string | null) =>
        set({ selectedColor: colorId }),

      setSelectedSize: (sizeId: string | null) => set({ selectedSize: sizeId }),

      setSelectedMinPrice: (selectedMinPrice: number | null) =>
        set((state) => ({
          selectedMinPrice: selectedMinPrice,
        })),
      setSelectedMaxPrice: (selectedMaxPrice: number | null) =>
        set((state) => ({
          selectedMaxPrice: selectedMaxPrice,
        })),
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
