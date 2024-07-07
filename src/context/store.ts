import { StateCreator, create } from "zustand";
import { persist, PersistOptions,} from "zustand/middleware";
import { getSession } from 'next-auth/react';

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
  userId?: string | null;
  addToCart: (product: Product, userId?: string) => void;
  removeFromCart: (productId: string, userId?: string) => void;
  clearCart: (uuserId?: string) => void;
  updateQuantity: (productId: string, amount: number, userId?: string) => void;
  initializeCart: (products: Product[], userId?: string) => void;
  setUser: (userId: string) => void;
}

interface FavoriteState {
  cartFavorited: Product[];
  userId?: string | null;
  favorites: string[];
  addToFavorite: (product: Product, userId?: string | null) => void;
  removeFromFavorite: (productId: string, userId?: string | null) => void;
  clearFavorite: (userId?: string | null) => void;

  toggleFavorite: (productId: string, userId?: string | null) => void;
}

export interface SelectionState {
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedSize: string | null;
 
  selectedMinPrice: number | null;
  selectedMaxPrice: number | null;

  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedBrand: (brandId: string | null) => void;
  
  setSelectedSize: (sizeId: string | null) => void;
  setSelectedMinPrice: (selectedMinPrice: number | null) => void;
  setSelectedMaxPrice: (selectedMaxPrice: number | null) => void;
}

export interface ColorState {
  selectedColor: string | null;
  setSelectedColor: (colorId: string | null) => void;
}

type MyPersistCart = (
  config: StateCreator<CartState>,
  options: PersistOptions<CartState>
) => StateCreator<CartState>;

type MyPersistFavorite = (
  config: StateCreator<FavoriteState>,
  options: PersistOptions<FavoriteState>
) => StateCreator<FavoriteState>;

export const useCartStore = create<CartState>(
  (persist as MyPersistCart)(
    (set) => ({
      cartItems: [],
      userId: null,
      addToCart: (product: Product, userId?: string) =>

        set((state: CartState) => {
          if (userId && state.userId && state.userId !== userId) return state;

          const index = state.cartItems.findIndex(
            (item) => item.id === product.id
          );

          if (index !== -1) {
            let newCartItems = [...state.cartItems];
            newCartItems[index] = {
              ...newCartItems[index],
              quantity: newCartItems[index].quantity + product.quantity,
              height: product.height,
              width: product.width,
              length: product.length,
              weight: product.weight,
            };
            console.log('cartItems',newCartItems)
            return { cartItems: newCartItems };
          }
          console.log('cartItems state',state)

          return { cartItems: [...state.cartItems, product] };
        }),

      removeFromCart: (productId: string, userId?: string) =>
        set((state: CartState) => {
          if (userId && state.userId && state.userId !== userId) return state;
          return {
            cartItems: state.cartItems.filter((item) => item.id !== productId),
          };
        }),

      clearCart: (userId?: string) =>
        set((state: CartState) => {
          if (userId && state.userId && state.userId !== userId) return state;
          return { cartItems: [] };
        }),

      updateQuantity: (productId: string, amount: number, userId?: string) =>
        set((state: CartState) => {
          if (userId && state.userId && state.userId !== userId) return state;
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
          return state;
        }),
      initializeCart: (products: Product[], userId?: string) =>
        set((state: CartState) => {
          if (userId && state.userId && state.userId !== userId) return state;
          return { cartItems: products };
        }),
        setUser: (userId: string) =>
          set((state: CartState) => ({
            userId,
          })),

    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export const useFavoritesStore = create<FavoriteState>(
  (persist as MyPersistFavorite)(
    (set) => ({
      cartFavorited: [],
      favorites: [],
      userId: null,

      addToFavorite: (product: Product, userId?: string | null) =>
        set((state: FavoriteState) => {
          if (userId && state.userId && state.userId !== userId) return state;

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

      toggleFavorite: (productId: string, userId?: string | null) =>
        set((state: FavoriteState) => {
          if (userId && state.userId && state.userId !== userId) return state;

          return {
            favorites: state.favorites.includes(productId)
              ? state.favorites.filter((id: string) => id !== productId)
              : [...state.favorites, productId],
          };
        }),

   removeFromFavorite: (productId: string, userId?: string | null) =>
        set((state: FavoriteState) => {
          if (userId && state.userId && state.userId !== userId) return state;

          const updatedCartFavorited = state.cartFavorited.filter(
            (item) => item.id !== productId
          );
          return { cartFavorited: updatedCartFavorited };
        }),

        clearFavorite: (userId?: string | null) =>
          set((state: FavoriteState) => {
            if (userId && state.userId && state.userId !== userId) return state;
            return { cartFavorited: [] };
          }),
    }),
    {
      name: "favorite-storage",
      getStorage: () => localStorage,
    }
  )
);

export const useColorStore = create<ColorState>()(
  persist(
    (set) => ({
      selectedColor: null,
      setSelectedColor: (colorId: string | null) =>
        set({ selectedColor: colorId }),
    }),
    {
      name: "color-storage",
      getStorage: () => localStorage,
    }
  )
);

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      selectedCategory: null,
      selectedBrand: null,
      
      selectedSize: null,
      selectedMinPrice: null,
      selectedMaxPrice: null,

      setSelectedCategory: (categoryId: string | null) =>
        set({ selectedCategory: categoryId }),

      setSelectedBrand: (brandId: string | null) =>
        set({ selectedBrand: brandId }),

     

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


