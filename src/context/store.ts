import { StateCreator, create } from 'zustand';
import { persist, PersistOptions, createJSONStorage } from 'zustand/middleware';
import { getSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import axios from 'axios';

// const debounceUpdateQuantity = debounce(
//     async (
//         userId: string,
//         cartId: string,
//         itemId: string,
//         quantity: number
//     ) => {
//         if (!userId || !cartId || !itemId) {
//             console.error('Missing parameters for debounceUpdateQuantity');
//             return;
//         }
//         try {
//             const session = await getSession();
//             const authToken = session?.accessToken;

//             const response = await axios.patch(
//                 `${BASE_URL}/cart/${userId}/item/${itemId}`,
//                 { quantity },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${authToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             return response.data.cart;
//         } catch (error) {
//             console.error('Error updating item quantity in backend:', error);
//         }
//     },
//     1500
// );

export interface Color {
    id: string;
    name: string;
    hex: string;
}

export interface Size {
    id: string;
    name: string;
}

interface Address {
    _id: {
        value: string;
    };
    props: {
        userId: string;
        street: string;
        number: number;
        complement?: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        createdAt: string;
        updatedAt: string;
    };
}

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
    _id?: { value: string };
}

interface CartItem extends Product {
    _id: {
        value: string;
    };
    cartId?: string;
    props: {
        productId: string;
        productName: string;
        imageUrl: string;
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
    cartId?: string | null;
    userId?: string | null;
    selectedAddress?: Address | null;
    addToCart: (product: Product, userId?: string) => void;
    removeFromCart: (cartId: string, cartItemId: string) => void;
    selectedShippingOption?: ShippingOption | null;
    clearCart: (userId?: string) => void;
    clearStorage: () => void;
    updateQuantity: (
        productId: string,
        amount: number,
        userId?: string
    ) => void;
    initializeCart: (products: Product[], userId?: string) => Promise<void>;
    setUser: (userId: string) => void;
    setSelectedAddress: (address: Address | null) => void;
    setSelectedShippingOption: (option: ShippingOption | null) => void;
    getSelectedShippingOption: () => ShippingOption | null;
    saveCartToBackend: (
        userId: string,
        item: Product
    ) => Promise<SaveCartResponse>;
    removeItemFromBackend: (cartId: string, cartItemId: string) => void;
    fetchCart: (userId: string) => Promise<Cart | null>;
    getCartItemsAndAddressForShipping: () => {
        products: Array<{
            id: string;
            width: number;
            height: number;
            length: number;
            weight: number;
            insurance_value: number;
            quantity: number;
        }>;
        address: { zipCode: string };
    };
    logState: () => void;
    preferenceId?: string | null;
    createPreference: (
        cartId: string,
        token: string,
        shippingOption: ShippingOption
    ) => Promise<any>;
    setPreferenceId: (preferenceId: string) => void;
}

interface ShippingOption {
    name: string;
    currency: string;
    delivery_time: number;
    price: number;
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

interface LoadingState {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export const useLoadingStore = create<LoadingState>()(
    persist(
        (set) => ({
            isLoading: false,
            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'loading-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export const useCartStore = create<CartState>(
    (persist as MyPersistCart)(
        (set, get) => ({
            cartId: null,
            cartItems: [],
            userId: null,
            selectedAddress: null,
            preferenceId: null,

            addToCart: async (product: Product) => {
                const existingItem = get().cartItems.find(
                    (item) => item.id === product.id
                );
                if (existingItem) {
                    set((state) => ({
                        cartItems: state.cartItems.map((item) =>
                            item.id === product.id
                                ? {
                                      ...item,
                                      quantity:
                                          item.quantity + product.quantity,
                                  }
                                : item
                        ),
                    }));
                } else {
                    set((state) => ({
                        cartItems: [...state.cartItems, product],
                    }));
                }

                const { userId } = get();

                if (userId) {
                    const savedItem = await get().saveCartToBackend(
                        userId,
                        product
                    );

                    console.log('savedItem', savedItem);

                    set((state) => ({
                        cartItems: state.cartItems.map((item) =>
                            item.id === product.id
                                ? {
                                      ...item,
                                      _id: { value: savedItem.cartItemId },
                                      cartId: savedItem.cartId,
                                  }
                                : item
                        ),
                        cartId: savedItem.cartId,
                    }));
                }
            },

            removeFromCart: async (productId: string) => {
                console.log('removeFromCart inicio productId', productId);
                const { userId, cartItems, cartId } = get();

                const itemToRemove = cartItems.find(
                    (item) => item.id === productId
                );
                const cartItemId = itemToRemove?._id?.value;
                console.log('removeFromCart cartItemId', cartItemId);
                console.log('removeFromCart itemToRemove', itemToRemove);

                if (!cartItemId) {
                    console.error('cartItemId not found in cart');
                    return;
                }
                if (!cartId) {
                    console.error('cartId not found in cart');
                    return;
                }

                if (userId) {
                    try {
                        get().removeItemFromBackend(cartId, cartItemId);

                        set((state) => ({
                            cartItems: state.cartItems.filter(
                                (item) => item.id !== productId
                            ),
                        }));
                        console.log(
                            `Item ${cartItemId} removed from cart and backend for user ${userId}`
                        );
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
                    console.log('iniciou fetchCart');
                    const session = await getSession();
                    const authToken = session?.accessToken;

                    const response = await axios.get(
                        `${BASE_URL}/cart/user/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log('ifetchCart response', response.data);

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

            clearStorage: () => {
                set(() => ({
                    cartItems: [],
                    cartId: null,
                    userId: null,
                    selectedAddress: null,
                    preferenceId: null,
                    selectedShippingOption: null,
                }));
                sessionStorage.removeItem('cart-storage');
            },

            updateQuantity: (
                productId: string,
                amount: number,
                userId?: string
            ) => {
                const { cartId, cartItems, userId: stateUserId } = get();
                const actualUserId = userId || stateUserId;

                if (!actualUserId || !cartId) return;

                const index = cartItems.findIndex(
                    (item) => item.id === productId
                );

                if (index !== -1) {
                    const currentItem = cartItems[index];
                    const newQuantity = currentItem.quantity + amount;

                    if (currentItem._id && currentItem._id.value) {
                        const itemId = currentItem._id.value;
                        set((state) => {
                            const newCartItems = state.cartItems.map((item) =>
                                item.id === productId
                                    ? { ...item, quantity: newQuantity }
                                    : item
                            );
                            return {
                                cartItems: newCartItems,
                            };
                        });

                        if (!actualUserId && !cartId && !itemId) {
                            console.error('cartItemId not found in cart');
                            return;
                        }

                        // if (actualUserId && cartId && itemId && newQuantity) {
                        //     debounceUpdateQuantity(
                        //         actualUserId,
                        //         cartId,
                        //         itemId,
                        //         newQuantity
                        //     )
                        //         .then((updatedCart) => {
                        //             if (updatedCart) {
                        //                 const newCartItems =
                        //                     updatedCart.items.map(
                        //                         (item: any) => ({
                        //                             ...item.props,
                        //                             id: item.props.productId,
                        //                             _id: { value: item.id },
                        //                             cartId: item.cartId,
                        //                         })
                        //                     );

                        //                 set({
                        //                     cartItems: newCartItems,
                        //                     cartId: updatedCart.id,
                        //                 });
                        //             }
                        //         })
                        //         .catch((error) => {
                        //             console.error(
                        //                 'Error updating cart state:',
                        //                 error
                        //             );
                        //         });
                        // }
                    } else {
                        console.error('Cart item ID is missing');
                    }
                }
            },

            initializeCart: async (products: Product[], userId?: string) => {
                if (userId) {
                    const fetchedCart = await get().fetchCart(userId);
                    console.log('fetchedCart', fetchedCart);

                    if (fetchedCart) {
                        const items = fetchedCart.props.items.map(
                            (item: any) => ({
                                id: item.props.productId,
                                title: item.props.productName,
                                image: item.props.imageUrl,
                                quantity: item.props.quantity,
                                price: item.props.price,
                                height: item.props.height,
                                width: item.props.width,
                                length: item.props.length,
                                weight: item.props.weight,
                                color: item.props.color,
                                colorId: item.props.colorId,
                                size: item.props.size,
                                sizeId: item.props.sizeId,
                                hasVariants: item.props.hasVariants,
                                productIdVariant: item.props.productIdVariant,
                                _id: { value: item._id.value },
                                cartId: fetchedCart._id.value,
                            })
                        );
                        console.log('items', items);
                        set((state) => {
                            const newState = {
                                cartItems: items,
                                cartId: fetchedCart._id.value,
                                userId,
                            };
                            console.log(
                                'New state after fetching cart:',
                                newState
                            );
                            return newState;
                        });
                        return;
                    }
                }
                set((state) => {
                    const newState = {
                        cartItems: products,
                        userId: userId || get().userId || null,
                    };
                    console.log(
                        'New state after setting initial cart:',
                        newState
                    );
                    return newState;
                });
            },

            setUser: (userId: string) =>
                set((state: CartState) => ({
                    userId,
                })),

            setSelectedAddress: (address: Address | null) =>
                set((state: CartState) => ({
                    ...state,
                    selectedAddress: address,
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
                    cartId: 'undefined',
                    quantity: product.quantity,
                    price: product.price,
                    colorId: product.colorId,
                    productName: product.title,
                    imageUrl: product.image,

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

                    console.log('authToken no saveCartToBackend', authToken);
                    console.log('session no saveCartToBackend', session);

                    const existsResponse = await axios.get(
                        `${BASE_URL}/cart/${userId}/exists`,
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
                            `${BASE_URL}/cart/add-item/${userId}`,
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
                            cartId: addItemResponse.data.props.cartId,
                            cartItemId: addItemResponse.data._id.value,
                        };
                    } else {
                        console.log('cart nao existe, vamos criar item', item);

                        const createCartResponse = await axios.post(
                            `${BASE_URL}/cart/`,
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
                        'removeItemFromBackend inicio cartId cartItemId',
                        cartId,
                        cartItemId
                    );

                    const session = await getSession();
                    const authToken = session?.accessToken;

                    const removedItemResult = await axios.delete(
                        `${BASE_URL}/cart/${cartId}/item/${cartItemId}`,
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

            getCartItemsAndAddressForShipping: () => {
                console.log('entrou no getCartItemsAndAddressForShipping');
                const { userId } = get();
                const { cartItems } = get();
                const { selectedAddress } = get();

                console.log(
                    'getCartItemsAndAddressForShipping cartItems: ',
                    cartItems
                );
                console.log(
                    'getCartItemsAndAddressForShipping selectedAddress: ',
                    selectedAddress
                );
                console.log(
                    'getCartItemsAndAddressForShipping userId: ',
                    userId
                );

                if (!cartItems || cartItems.length === 0) {
                    console.error('No cart items found');
                    return { products: [], address: { zipCode: '' } };
                }

                const products = cartItems.map((item) => ({
                    id: item.id,
                    width: item.width,
                    height: item.height,
                    length: item.length,
                    weight: item.weight,
                    insurance_value: item.price * item.quantity,
                    quantity: item.quantity,
                }));
                console.log(
                    'getCartItemsAndAddressForShipping cartItems products ',
                    cartItems,
                    products
                );

                const address = selectedAddress
                    ? { zipCode: selectedAddress?.props?.zipCode }
                    : { zipCode: '' };

                return { products, address };
            },

            logState: () => {
                console.log('Cart State:', get());
            },

            setSelectedShippingOption: (option: ShippingOption | null) =>
                set((state: CartState) => ({
                    ...state,
                    selectedShippingOption: option,
                })),

            getSelectedShippingOption: () => {
                const option = get().selectedShippingOption;
                return option !== undefined ? option : null;
            },
            setPreferenceId: (preferenceId: string) => {
                set({ preferenceId });
            },

            createPreference: async (
                cartId: string,
                id: string,
                shippingOption: ShippingOption
            ) => {
                const { cartItems } = get();
                const total = cartItems.reduce(
                    (acc, item) =>
                        acc + Number(item.price) * Number(item.quantity),
                    0
                );
                const shippingPrice = Number(shippingOption.price);
                const totalWithShipping = total + shippingPrice;

                console.log(
                    'createPreference totalWithShipping',
                    totalWithShipping
                );
                console.log('Cart total:', total);
                console.log('Shipping price:', shippingPrice);
                console.log('Total with shipping:', totalWithShipping);

                const formattedTotalWithShipping = parseFloat(
                    totalWithShipping.toFixed(2)
                );
                console.log(
                    'Formatted total with shipping:',
                    formattedTotalWithShipping
                );

                const preferenceData = {
                    id,
                    description: 'Carrinho de Compras Stylos Lingeries',
                    price: formattedTotalWithShipping,
                    quantity: 1,
                };
                console.log('createPreference preferenceData', preferenceData);

                console.log(
                    'createPreference JSON.stringify(preferenceData)',
                    JSON.stringify(preferenceData)
                );

                try {
                    const session = await getSession();
                    const authToken = session?.accessToken;
                    const url = `${BASE_URL}/cart/create-preference`;
                    console.log('createPreference url', url);
                    console.log('createPreference authToken', authToken);
                    const response = await axios.post(
                        url,
                        { cartId, ...preferenceData },
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log('createPreference response', response);
                    const preferenceId = response.data.id;
                    set({ preferenceId });

                    return response.data;
                } catch (error) {
                    console.error('Error creating preference:', error);
                    throw error;
                }
            },
        }),

        {
            name: 'cart-storage',
            storage: createJSONStorage(() => sessionStorage),
        } as PersistOptions<CartState>
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
            storage: createJSONStorage(() => sessionStorage),
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
            storage: createJSONStorage(() => sessionStorage),
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
            storage: createJSONStorage(() => sessionStorage),
        } as PersistOptions<SelectionState>
    )
);
