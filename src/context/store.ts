import { StateCreator, create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { getSession } from 'next-auth/react';
import axios from 'axios';

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
    colorId?: string;
    size?: string;
    sizeId?: string;
    hasVariants: boolean;
    productIdVariant?: string;
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
        productIdVariant?: string;
        hasVariants: boolean;
        price: number;
        height: number;
        width: number;
        length: number;
        weight: number;
        color?: string;
        colorId?: string;
        size?: string;
        sizeId?: string;
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

interface SaveCartResponse {
    cartId: string;
    cartItemId: string;
}

interface CartState {
    cartItems: Product[];
    userId?: string | null;
    addToCart: (product: Product, userId?: string) => void;
    removeFromCart: (cartId: string, cartItemId: string) => void;
    clearCart: (uuserId?: string) => void;
    updateQuantity: (
        productId: string,
        amount: number,
        userId?: string
    ) => void;
    initializeCart: (products: Product[], userId?: string) => void;
    setUser: (userId: string) => void;
    saveCartToBackend: (
        userId: string,
        item: Product
    ) => Promise<SaveCartResponse>;
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

type MyPersistFavorite = (
    config: StateCreator<FavoriteState>,
    options: PersistOptions<FavoriteState>
) => StateCreator<FavoriteState>;

type MyPersistCart = (
    config: StateCreator<CartState>,
    options: PersistOptions<CartState>
) => StateCreator<CartState>;

export const useCartStore = create<CartState>(
    (persist as MyPersistCart)(
        (set, get) => ({
            cartItems: [],
            userId: null,

            addToCart: async (product: Product) => {
                set((state) => {
                    const index = state.cartItems.findIndex(
                        (item) => item.id === product.id
                    );

                    if (index !== -1) {
                        let newCartItems = [...state.cartItems];
                        newCartItems[index] = {
                            ...newCartItems[index],
                            quantity:
                                newCartItems[index].quantity + product.quantity,
                        };
                        return {
                            cartItems: newCartItems,
                            userId: state.userId || null,
                        };
                    }

                    return {
                        cartItems: [...state.cartItems, product],
                        userId: state.userId || null,
                    };
                });

                const { userId } = get();

                if (userId) {
                    // const item = {
                    //     id: product.id,
                    //     productId: product.id,
                    //     title: product.title,
                    //     image: product.image,
                    //     quantity: product.quantity,
                    //     price: product.price,
                    //     height: product.height,
                    //     width: product.width,
                    //     length: product.length,
                    //     weight: product.weight,
                    //     hasVariants: product.hasVariants,
                    //     color: product.hasVariants
                    //         ? product.color?.name
                    //         : undefined,
                    //     colorId: product.hasVariants
                    //         ? product.color?.id
                    //         : undefined,
                    //     size: product.hasVariants
                    //         ? product.size?.name
                    //         : undefined,
                    //     sizeId: product.hasVariants
                    //         ? product.size?.id
                    //         : undefined,
                    //     productIdVariant: product.hasVariants
                    //         ? product.productIdVariant
                    //         : undefined,
                    // };
                    const savedItem = await get().saveCartToBackend(
                        userId,
                        product
                    );

                    console.log('savedItem', savedItem);

                    set((state) => {
                        const updatedCartItems = state.cartItems.map((item) =>
                            item.id === product.id
                                ? {
                                      ...item,
                                      _id: { value: savedItem.cartItemId },
                                  }
                                : item
                        );
                        console.log('updatedCartItems', updatedCartItems);
                        console.log('savedItem', savedItem.cartId);
                        return {
                            cartItems: updatedCartItems,
                            cartId: savedItem.cartId,
                        };
                    });
                }
            },

            removeFromCart: async (cartId: string, cartItemId: string) => {
                console.log('removeFromCart inicio cartId', cartId);
                console.log('removeFromCart inicio cartItemId', cartItemId);
                const { userId } = get();

                if (!cartItemId) {
                    console.error('cartItemId is undefined');
                    return;
                }

                if (userId) {
                    try {
                        const cartResult = await get().fetchCart(userId);

                        console.log('removeFromCart cartResult', cartResult);

                        const cartItem = cartResult?.props.items.find(
                            (item) => item._id.value === cartItemId
                        );
                        console.log('removeFromCart cartItem', cartItem);
                        if (cartItem) {
                            await get().removeItemFromBackend(
                                cartId,
                                cartItemId
                            );
                            set((state) => ({
                                cartItems: state.cartItems.filter(
                                    (item) =>
                                        item.id !== cartItem.props.productId
                                ),
                            }));
                            console.log(
                                `Item ${cartItemId} removed from cart and backend for user ${userId}`
                            );
                        } else {
                            console.error('Cart item not found');
                        }
                    } catch (error) {
                        console.error(
                            'Error removing item from backend:',
                            error
                        );
                    }
                } else {
                    set((state) => ({
                        cartItems: state.cartItems.filter(
                            (item) => item.id !== cartItemId
                        ),
                    }));
                    console.log(`Item ${cartItemId} removed from cart locally`);
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
                    if (userId && state.userId && state.userId !== userId)
                        return state;
                    return { cartItems: [] };
                }),

            updateQuantity: (
                productId: string,
                amount: number,
                userId?: string
            ) =>
                set((state: CartState) => {
                    if (userId && state.userId && state.userId !== userId)
                        return state;
                    const index = state.cartItems.findIndex(
                        (item) => item.id === productId
                    );

                    if (index !== -1) {
                        let newQuantity =
                            state.cartItems[index].quantity + amount;
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
                    if (userId && state.userId && state.userId !== userId)
                        return state;
                    return {
                        cartItems: products,
                        userId: userId || state.userId || null,
                    };
                }),

            setUser: (userId: string) =>
                set((state: CartState) => ({
                    userId,
                })),

            saveCartToBackend: async (
                userId: string,
                product: Product
            ): Promise<SaveCartResponse> => {
                console.log(
                    'entrou saveCartToBackend userId product',
                    userId,
                    product
                );
                const item = {
                    productId: product.id,
                    cartId:'undefined',
                    quantity: product.quantity,
                    price: product.price,
                    colorId: product.colorId,

                    sizeId: product.sizeId,

                    height: product.height,
                    hasVariants: product.hasVariants,
                    width: product.width,
                    length: product.length,
                    weight: product.weight,
                    productIdVariant: product.productIdVariant,
                };

                try {
                    console.log('item no saveCartToBackend', item);

                    const session = await getSession();
                    const authToken = session?.accessToken;

                    const existsResponse = await axios.get(
                        `http://localhost:3333/cart/${userId}/exists`,
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log('existsResponse', existsResponse);

                    if (existsResponse.data.exists) {
                        console.log(
                            'existsResponse.data.exists',
                            existsResponse.data.exists
                        );
                        console.log('existsResponse.data.exists item ', item);

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

                        console.log('addItemResponse ', addItemResponse);
                        console.log(
                            'addItemResponse cartId',
                            addItemResponse.data.props.cartId
                        );

                        console.log(
                            'addItemResponse.data.itemId',
                            addItemResponse.data._id.value
                        );

                        return {
                            cartId: existsResponse.data.cartId,
                            cartItemId: addItemResponse.data._id.value,
                        };
                    } else {
                        console.log('cart nao existe, vamos criar item', item);
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

                        console.log('createCartResponse', createCartResponse);

                        console.log(
                            'createCartResponse',
                            createCartResponse.data
                        );

                        console.log(
                            'createCartResponse createCartResponse.data.cart._id.value',
                            createCartResponse.data.cart._id.value
                        );
                        console.log(
                            'createCartResponse createCartResponse.data.cart.props.items[0]._id.value',
                            createCartResponse.data.cart.props.items[0]._id
                                .value
                        );

                        return {
                            cartId: createCartResponse.data.cart._id.value,
                            cartItemId:
                                createCartResponse.data.cart.props.items[0]._id
                                    .value,
                        };
                    }
                } catch (error) {
                    console.error('Error saving cart to backend:', error);
                    throw error;
                }
            },

            removeItemFromBackend: async (
                cartId: string,
                cartItemId: string
            ) => {
                try {
                    console.log(
                        'removeItemFromBackend cartId cartItemId',
                        cartId,
                        cartItemId
                    );
                    const session = await getSession();
                    const authToken = session?.accessToken;

                    const removedItemResult = await axios.delete(
                        `http://localhost:3333/cart/${cartId}/item/${cartItemId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log(
                        'removeItemFromBackend removedItemResult',
                        removedItemResult
                    );

                    return removedItemResult;
                } catch (error) {
                    console.error('Error removing item from backend:', error);
                }
            },
        }),
        {
            name: 'cart-storage',
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
                    if (userId && state.userId && state.userId !== userId)
                        return state;

                    const index = state.cartFavorited.findIndex(
                        (item) => item.id === product.id
                    );

                    if (index !== -1) {
                        let newFavoritedItems = [...state.cartFavorited];
                        newFavoritedItems[index] = {
                            ...newFavoritedItems[index],
                            quantity:
                                newFavoritedItems[index].quantity +
                                product.quantity,
                        };
                        return { cartFavorited: newFavoritedItems };
                    }

                    return { cartFavorited: [...state.cartFavorited, product] };
                }),

            toggleFavorite: (productId: string, userId?: string | null) =>
                set((state: FavoriteState) => {
                    if (userId && state.userId && state.userId !== userId)
                        return state;

                    return {
                        favorites: state.favorites.includes(productId)
                            ? state.favorites.filter(
                                  (id: string) => id !== productId
                              )
                            : [...state.favorites, productId],
                    };
                }),

            removeFromFavorite: (productId: string, userId?: string | null) =>
                set((state: FavoriteState) => {
                    if (userId && state.userId && state.userId !== userId)
                        return state;

                    const updatedCartFavorited = state.cartFavorited.filter(
                        (item) => item.id !== productId
                    );
                    return { cartFavorited: updatedCartFavorited };
                }),

            clearFavorite: (userId?: string | null) =>
                set((state: FavoriteState) => {
                    if (userId && state.userId && state.userId !== userId)
                        return state;
                    return { cartFavorited: [] };
                }),
        }),
        {
            name: 'favorite-storage',
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
            name: 'color-storage',
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
            name: 'selection-storage',
            getStorage: () => localStorage,
        } as PersistOptions<SelectionState>
    )
);
