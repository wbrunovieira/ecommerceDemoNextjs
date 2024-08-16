'use client';
import { useCartStore } from '@/context/store';
import Image from 'next/image';

import { useSession } from 'next-auth/react';
import { BsTrash, BsPlus, BsDash } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';

import { useRouter } from 'next/navigation';
import AddressModal from './AddressModal';

interface FloatCartProps {
    onClose: () => void;
}

interface Product {
    id: string;
    quantity: number;
    title: string;
    image: string;
    price: number;
    color?: string;
    size?: string;
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

const FloatCart: React.FC<FloatCartProps> = ({ onClose }) => {
    const [clickedTrash, setClickedTrash] = useState<string | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(
        null
    );

    const [isLoading, setIsLoading] = useState(false);

    const cartItems = useCartStore((state: any) => state.cartItems);
    const removeFromCart = useCartStore((state: any) => state.removeFromCart);
    const updateQuantity = useCartStore((state: any) => state.updateQuantity);
    const setSelectedAddressInStore = useCartStore(
        (state: any) => state.setSelectedAddress
    );
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const setUser = useCartStore((state) => state.setUser);
    const initializeCart = useCartStore((state: any) => state.initializeCart);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const fetchAddresses = async () => {
        try {
            console.log('fetchAddresses entrou ');
            const response = await fetch(
                `${BASE_URL}/adress/by-user-id?userId=${session?.user?.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            console.log('fetchAddresses entrou response ', response);
            if (response.ok) {
                const data = await response.json();
                const foundAddresses = data.addresses;
                if (foundAddresses && foundAddresses.length > 0) {
                    setAddresses(foundAddresses);
                    setShowAddressModal(true);
                } else {
                    setShowAddressModal(true);
                }
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowAddressModal(false);
    };

    const handleModalConfirm = (selectedAddress: Address) => {
        setSelectedAddress(selectedAddress);
        setSelectedAddressInStore(selectedAddress);
        handleModalClose();
        router.push('/frete');
    };

    const handleClickOutside = (event: React.MouseEvent) => {
        const modalElement = document.querySelector('.modal-content');
        if (modalElement && !modalElement.contains(event.target as Node)) {
            onClose();
        }
    };

    const increaseQuantity = (id: string) => {
        updateQuantity(id, 1);
    };

    const decreaseQuantity = (id: string) => {
        updateQuantity(id, -1);
    };

    const handleRemoveFromCart = async (productId: string) => {
        await removeFromCart(productId);
        toast({
            title: 'Item removido do carrinho',
            description: 'Seu item foi removido do carrinho com sucesso!',
            style: { background: '#ff6961' },
        });
        setClickedTrash(null);
    };

    const handleCheckout = async () => {
        if (!session) {
            toast({
                title: 'Necessário login',
                description:
                    'Você precisa estar logado para finalizar a compra.',
                style: { background: '#ff6961' },
            });
            router.push('/login');
        } else {
            setIsLoading(true);
            await fetchAddresses();

            setShowAddressModal(true);
        }
    };

    const handleAddNewAddresses = (address: Address) => {
        setAddresses((prevAddresses) => [...prevAddresses, address]);
        setShowAddressModal(true);
    };

    useEffect(() => {
        const initializeUserCart = async () => {
            if (session?.user?.id) {
                setUser(session.user.id);
                const cartInit = await initializeCart([], session.user.id);
                console.log('initializeUserCart no float cartInit', cartInit);
            }
        };
        initializeUserCart();
    }, [session, setUser, initializeCart]);

    return (
        <div
            className="fixed top-28 right-2 flex items-center justify-center z-50 bg-primaryLight border rounded-md shadow-xl border-secondary bg-opacity-80 modal-background"
            onClick={handleClickOutside}
        >
            <div
                className="relative bg-white rounded-lg shadow-xl p-6 mb-4 max-w-lg w-full modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="text-xl text-primaryDark font-semibold"
                >
                    X
                </button>

                <div className="flex justify-center items-center gap-2 border-b-2 border-light pb-4">
                    <h2 className="text-xl font-bold">Carrinho - </h2>
                    <span className="fontbold text-xl gap-1">
                        {cartItems.length}{' '}
                        {cartItems.length == 1 ? 'item' : 'itens'}{' '}
                    </span>
                </div>

                <ul className="flex flex-col pt-4">
                    <li className="flex justify-between items-center gap-4 border-b-2 border-light pb-4 text-sm">
                        <p>Imagem</p>
                        <p>Qt</p>
                        <p>Descrição</p>
                        <p>Unit R$</p>
                        <p>Total R$</p>
                        <p>Ação</p>
                    </li>
                    {cartItems.map((item: Product, index: number) => (
                        <li
                            key={index}
                            className="flex justify-between items-center mb-4 gap-2"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={20}
                                height={20}
                                quality={100}
                                unoptimized={true}
                                className="w-12 h-12 rounded"
                            />
                            <div className="flex items-center">
                                <button
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="text-sm p-1"
                                >
                                    <BsDash />
                                </button>
                                <p className="text-sm font-medium mx-2">
                                    {item.quantity} pç
                                </p>
                                <button
                                    onClick={() => increaseQuantity(item.id)}
                                    className="text-sm p-1"
                                >
                                    <BsPlus />
                                </button>
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="text-sm font-medium">
                                    {item.title}
                                </p>
                                {item.color && (
                                    <p className="text-xs text-gray-500">
                                        Cor: {item.color}
                                    </p>
                                )}
                                {item.size && (
                                    <p className="text-xs text-gray-500">
                                        Tamanho: {item.size}
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">
                                R$ {item.price}
                            </p>
                            <p className="text-sm font-bold">
                                R$ {item.quantity * item.price}
                            </p>
                            <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="bg-red-500 text-white p-1 rounded transition duration-300 hover:scale-105"
                            >
                                <BsTrash size={14} />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col justify-center align-center mt-4 border-t-2 border-light">
                    <div className="w-full flex justify-end items-center">
                        <p className="text-xl font-medium mt-4">
                            Total: R${' '}
                            {cartItems.reduce(
                                (acc: any, item: any) =>
                                    acc + item.price * item.quantity,
                                0
                            )}
                        </p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="px-4 py-2 mt-2 rounded bg-secondary text-primaryLight transition duration-300 hover:scale-105"
                    >
                        Checkout
                    </button>
                </div>
            </div>
            {showAddressModal && (
                <AddressModal
                    addresses={addresses}
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatCart;
