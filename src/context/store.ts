import { StateCreator, create } from "zustand";
import { persist, PersistOptions,} from "zustand/middleware";
import { getSession } from 'next-auth/react';
import axios from "axios";

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
  color?: string; 
  size?: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Size {
  id: string;
  name: string;
}

interface CartItem {
  _id: {
    value: string;
  };
  props: {
    productId: string;
    quantity: number;
    price: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    color?: string;
    size?: string;
  };
}

interface Cart {
  _id: {
    value: string;
  };
  props: {
    userId: string;
    items: CartItem[];
  };
}

interface CartState {
  cartItems: Product[];
  userId?: string | null;
  addToCart: (product: Product, userId?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string, userId?: string) => void;
  clearCart: (uuserId?: string) => void;
  updateQuantity: (productId: string, amount: number, userId?: string) => void;
  initializeCart: (products: Product[], userId?: string) => void;
  setUser: (userId: string) => void;
  saveCartToBackend: (userId: string, item: Product) => Promise<CartItem>;
  removeItemFromBackend: (cartId: string, cartItemId: string) => void;
  fetchCart: (userId: string) => Promise<Cart | null>;
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
  selectedSize: Size | null;
 
  selectedMinPrice: number | null;
  selectedMaxPrice: number | null;

  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedBrand: (brandId: string | null) => void;
  
  setSelectedSize: (size: Size | null) => void;
  setSelectedMinPrice: (selectedMinPrice: number | null) => void;
  setSelectedMaxPrice: (selectedMaxPrice: number | null) => void;
}

export interface ColorState {
  selectedColor: Color | null;
  setSelectedColor: (color: Color | null) => void;
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
    (set, get) => ({
      cartItems: [],
      userId: null,
      addToCart: async (product: Product) => {
        set((state) => {
          const index = state.cartItems.findIndex(
            (item) => item.id === product.id &&
                      item.color === product.color &&
                      item.size === product.size
          );

          if (index !== -1) {
            let newCartItems = [...state.cartItems];
            newCartItems[index] = {
              ...newCartItems[index],
              quantity: newCartItems[index].quantity + product.quantity,
            };
            return { cartItems: newCartItems, userId: state.userId || null };
          }

          return { cartItems: [...state.cartItems, product], userId: state.userId || null };
        });

        const { userId } = get();

        if (userId) {
          const savedItem = await get().saveCartToBackend(userId,  product);
          set((state) => {
            const updatedCartItems = state.cartItems.map((item) =>
              item.id === product.id && item.color === product.color && item.size === product.size
                ? { ...item, _id: { value: savedItem._id } }
                : item
            );
            return { cartItems: updatedCartItems };
          });
        
        }
      },

      removeFromCart: async (cartItemId: string, userId?: string) => {
        set((state: CartState) => {
          if (userId && state.userId && state.userId !== userId) return state;
          return {
            cartItems: state.cartItems.filter(
              (item) => item.id !== cartItemId
            ),
          };
        });

        const { userId: currentUserId } = get();

        if (currentUserId) {

          const cartResult = await get().fetchCart(currentUserId);

          console.log('cartResult em remove from cart',cartResult)

          if (cartResult) {

            const items = cartResult.props.items;

            console.log('entrrou no if em remove from cartcartResult .props.items',cartResult.props.items)

            console.log('entrrou no if em remove from cartcartResult .props.items items',items)

            const cartItem = items.find(item => item._id.value === cartItemId);

            console.log('entrrou no if em remove from cartcartItem',cartItem)
            if (cartItem) {
              console.log('ccCHAMNDO  BACK cartItem',cartItem)
            const removedItem =  await get().removeItemFromBackend(cartResult._id.value, cartItem._id.value);
            console.log('removedItem da storeeeee',removedItem)
            }
          }
        }
      },

      fetchCart: async (userId: string) => {
        try {
          const session = await getSession();
          const authToken = session?.accessToken;

          const response = await axios.get(
            `http://localhost:3333/cart/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          return response.data;
        } catch (error) {
          console.error('Error fetching cart:', error);
          return null;
        }
      },

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
          return { cartItems: products, userId: userId || state.userId || null };
        }),

        setUser: (userId: string) =>
          set((state: CartState) => ({
            userId,
          })),

          saveCartToBackend: async (userId: string, product: Product): Promise<CartItem> => {
            console.log('entrou save cart backend');
            const item = {
              productId: product.id,
              quantity: product.quantity,
              price: product.price,
              color: product.color,
              size: product.size,
              height: product.height,
              width: product.width,
              length: product.length,
              weight: product.weight,
            };
          
            console.log('entrou save cart backend item', item);
          
            try {
              const session = await getSession();
              const authToken = session?.accessToken;
          
              const response = await axios.get(
                `http://localhost:3333/cart/${userId}/exists`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
          
              console.log('retorno exists response.data', response.data);
          
              if (response.data.exists) {
                console.log('vamos la salvar no back o item', item);
          
                const addItemResponse = await axios.post(
                  `http://localhost:3333/cart/add-item/${userId}`,
                  item,
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                console.log('Item adicionado ao carrinho existente', addItemResponse.data);
                return {
                  _id: { value: addItemResponse.data.itemId },
                  props: item
                };
              } else {
                console.log('entrou para criar o cart userId', userId);
          
                const createCartResponse = await axios.post(
                  `http://localhost:3333/cart`,
                  { userId, items: [item] },
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                console.log('Novo carrinho criado', createCartResponse.data);
                return {
                  _id: { value: createCartResponse.data.items[0].itemId },
                  props: item
                };
              }
            } catch (error) {
              console.error('Error saving cart to backend:', error);
              throw error;
            }
          },
          
          
          

          removeItemFromBackend: async (cartId: string, cartItemId: string) => {
            try {
              console.log('removeItemFromBackend entrou cartId cartItemId',cartId,cartItemId)
            const session = await getSession();
          const authToken = session?.accessToken;

         const removedItemResult =  await axios.delete(
            `http://localhost:3333/cart/${cartId}/item/${cartItemId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Item removido do carrinho no backend removedItemResult',removedItemResult);
          return removedItemResult; 
            } catch (error) {
              console.error('Error removing item from backend:', error);
            }
          }

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
      setSelectedColor: (color: Color | null) =>
        set({ selectedColor: color }),
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

     

      setSelectedSize: (size: Size | null) => set({ selectedSize: size }),

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


