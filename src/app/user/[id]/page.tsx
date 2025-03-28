'use client';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, useFavoritesStore } from '@/context/store';
import { BiEdit } from 'react-icons/bi';
import { BsTrash } from 'react-icons/bs';
import Button from '@/components/Button';
import { useCallback, useEffect, useState } from 'react';
import { format, parseISO, parse } from 'date-fns';

import { BiArrowBack } from 'react-icons/bi';
import { BsCart4 } from 'react-icons/bs';

import DefaultIcon from '/public/images/default-icon.svg';
import { FileUpload } from '@/components/ui/file-upload';

export interface User {
    name: string;
    email: string;

    phone?: string;

    birthDate?: string;
    gender?: string;
    profileImageUrl?: string;
}

interface Product {
    id: string;
    quantity: number;
    title: string;
    image: string;
    price: number;
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

interface Order {
    _id: {
        value: string;
    };
    props: {
        userId: string;
        items: Item[];
        status: string;
        paymentId: string;
        paymentStatus: string;
        paymentMethod: string;
        paymentDate: string;
    };
}

interface Item {
    _id: {
        value: string;
    };
    props: {
        orderId: string;
        productId: string;
        productName: string;
        imageUrl: string;
        quantity: number;
        price: number;
    };
}

const UserPage: NextPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [originalUserDetails, setOriginalUserDetails] = useState<
        Partial<User>
    >({});

    const [userDetails, setUserDetails] = useState<Partial<User>>({
        name: '',
        email: '',
        phone: '',
        gender: '',
        birthDate: '',
    });

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(
        null
    );
    const [isCreatingNewAddress, setIsCreatingNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address['props']>>({});
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const favorited = useFavoritesStore((state: any) => state.favorites);
    const cartFavorited = useFavoritesStore(
        (state: any) => state.cartFavorited
    );
    const removeFromFavorite = useFavoritesStore(
        (state: any) => state.removeFromFavorite
    );
    const addToCart = useCartStore((state: any) => state.addToCart);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^(?:\+55\s?)?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        return phoneRegex.test(phone);
    };

    const handleBlur = (value: string) => {
        if (!validatePhoneNumber(value)) {
            setErrorMessage(
                'Por favor, insira um número de telefone válido com DDD.'
            );
        } else {
            setErrorMessage('');
        }
    };

    const handleEditAddress = (addressId: string) => {
        setEditingAddressId(addressId);
    };

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/orders/user/${session?.user?.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    }, [session?.user?.id, session?.accessToken, BASE_URL]);

    const handleSaveAddress = async (address: Address) => {
        const removeEmptyFields = (obj: any) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, v]) => v != null && v !== '')
            );
        };

        const cleanedUserDetails = removeEmptyFields({
            ...userDetails,
            birthDate: userDetails.birthDate
                ? parse(
                      userDetails.birthDate,
                      'dd/MM/yyyy',
                      new Date()
                  ).toISOString()
                : null,
        });

        try {
            const response = await fetch(
                `${BASE_URL}/adress/${session?.user?.id}/addresses/${address._id.value}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                    body: JSON.stringify(cleanedUserDetails),
                }
            );

            if (response.ok) {
                fetchAddresses();
                setEditingAddressId(null);
            } else {
                console.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address', error);
        }
    };

    const fetchAddresses = useCallback(async () => {
        try {
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

            if (response.ok) {
                const data = await response.json();

                setAddresses(data.addresses);
                setUserDetails({
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone || '',
                    gender: data.user.gender || '',
                    birthDate: data.user.birthDate
                        ? format(parseISO(data.user.birthDate), 'dd/MM/yyyy')
                        : '',
                    profileImageUrl: data.user.profileImageUrl || '',
                });
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses', error);
        }
    }, [session?.user?.id, session?.accessToken, BASE_URL]);

    const handleDeleteAddress = async (addressId: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/adress/addresses/${addressId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                fetchAddresses();
            } else {
                console.error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address', error);
        }
    };

    const handleEditUser = () => {
        setIsEditingUser(true);
        setOriginalUserDetails(userDetails);
    };

    const handleCancelEditUser = () => {
        setUserDetails(originalUserDetails);
        setIsEditingUser(false);
    };

    const handleSaveUserPhoto = async (newProfileImageUrl?: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/accounts/edit/${session?.user?.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                    body: JSON.stringify({
                        profileImageUrl: newProfileImageUrl,
                    }),
                }
            );

            if (response.ok) {
            } else {
                console.error(
                    'Falha ao atualizar o usuário:',
                    response.statusText
                );
            }
        } catch (error) {
            console.error('Erro ao atualizar o usuário:', error);
        }
    };

    const handleSaveUser = async () => {
        const removeEmptyFields = (obj: any) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, v]) => v != null && v !== '')
            );
        };

        const cleanedUserDetails = removeEmptyFields({
            ...userDetails,
            birthDate: userDetails.birthDate
                ? parse(
                      userDetails.birthDate,
                      'dd/MM/yyyy',
                      new Date()
                  ).toISOString()
                : null,
        });
        try {
            const response = await fetch(
                `${BASE_URL}/accounts/edit/${session?.user?.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                    body: JSON.stringify(cleanedUserDetails),
                }
            );

            if (response.ok) {
                setIsEditingUser(false);
            } else {
                if (response.status === 409) {
                    console.error(
                        'Conflict error: The user data may be conflicting with existing data.'
                    );
                } else {
                    console.error(
                        'Failed to update user:',
                        response.statusText
                    );
                }
            }
        } catch (error) {
            console.error('Error updating user', error);
        }
    };

    const handleImageUpload = async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const file = newFiles[0];
            const formData = new FormData();
            formData.append('file', file);

            if (userDetails.profileImageUrl) {
                formData.append('oldFileUrl', userDetails.profileImageUrl);
            }

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();

                    setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        profileImageUrl: data.imageUrl,
                    }));

                    await handleSaveUserPhoto(data.imageUrl);
                } else {
                    console.error(
                        'Erro ao fazer upload da imagem:',
                        response.statusText
                    );
                }
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
            }
        }
    };

    const handleCreateAddress = async () => {
        try {
            const url = `${BASE_URL}/adress/${session?.user?.id}/addresses`;
            const body = JSON.stringify({
                userId: session?.user?.id,
                street: newAddress.street,
                number: newAddress.number,
                complement: newAddress.complement,
                city: newAddress.city,
                state: newAddress.state,
                country: newAddress.country,
                zipCode: newAddress.zipCode,
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    street: newAddress.street,
                    number: newAddress.number,
                    complement: newAddress.complement,
                    city: newAddress.city,
                    state: newAddress.state,
                    country: newAddress.country,
                    zipCode: newAddress.zipCode,
                }),
            });

            if (response.ok) {
                fetchAddresses();
                setIsCreatingNewAddress(false);
                setNewAddress({});
            } else {
                console.error('Failed to create address');
            }
        } catch (error) {
            console.error('Error creating address', error);
        }
    };

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/accounts${session?.user?.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUserDetails({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    gender: data.gender || '',
                    birthDate: data.birthDate
                        ? format(parseISO(data.birthDate), 'dd/MM/yyyy')
                        : '',
                    profileImageUrl: data.profileImageUrl || '',
                });
            } else {
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error fetching user details', error);
        }
    }, [session?.user?.id, session?.accessToken, BASE_URL]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchUserDetails();
            fetchAddresses();
            fetchOrders();
        }
    }, [session?.user?.id, fetchAddresses, fetchOrders, fetchUserDetails]);

    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (!session) {
        router.push('/auth/signin');
        return null;
    }

    return (
        <div className=" max-w-4xl mx-auto mt-10 px-4 bg-primaryLight  rounded-xl shadow-lg z-10">
            <h1 className="text-2xl pt-4 text-primaryDark   font-bold text-center mb-4 z-10">
                Perfil do Usuário
            </h1>
            <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4 z-10" />

            <div className="flex justify-between items-center z-10 ">
                <Link
                    href="/"
                    className="flex items-center justify-center text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105 z-10 whitespace-nowrap"
                >
                    <BiArrowBack className="mr-1.5 " /> Home
                </Link>

                <div className="flex flex-col items-center justify-center z-20  ">
                    <FileUpload onChange={handleImageUpload} />

                    {userDetails.profileImageUrl ? (
                        <Image
                            src={userDetails.profileImageUrl}
                            alt="Imagem do usuário"
                            width={100}
                            height={100}
                            className="rounded-full mb-4 "
                        />
                    ) : (
                        <div className="flex items-center justify-start p-0 m-0">
                            <DefaultIcon
                                width={100}
                                className="rounded-full mb-4 z-20"
                                height={100}
                            />
                        </div>
                    )}
                </div>

                <Link
                    href="/cart"
                    className="flex items-center justify-center text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105 whitespace-nowrap"
                >
                    <BsCart4
                        size={16}
                        className="mr-1 text-primaryLight align-baseline"
                    />
                    <span className="align-baseline">Carrinho</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-primaryLight  max-w-4xl z-10 ">
                <div className="bg-primaryLight  pt-2 z-10 rounded p-4">
                    <p className="text-primaryDark  pt-2">Favoritos :</p>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4 z-10" />
                    <div>
                        <div className="flex flex-col w-72 gap-4  bg-primaryLight rounded-md p-2 z-10">
                            {cartFavorited.map(
                                (item: Product, index: number) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-md flex gap-2 divide-x divide-stone-200 border border-secondary "
                                    >
                                        <div className="flex gap-2 divide-stone-200">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={50}
                                                height={50}
                                                className="rounded mb-2 object-none"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 ml-2">
                                            <p className="text-xs text-primaryDark ml-2">
                                                {item.title}
                                            </p>

                                            <div className="flex gap-2 ml-2 content-center">
                                                <div
                                                    className="text-primaryLight  
          bg-secondary rounded transition duration-300
           hover:scale-105 content-center"
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => {
                                                            addToCart({
                                                                id: item.id,
                                                                image: item.image,
                                                                quantity:
                                                                    item.quantity,
                                                                price: item.price,
                                                                title: item.title,
                                                            });
                                                            removeFromFavorite(
                                                                item.id
                                                            );
                                                        }}
                                                    >
                                                        Adcionar ao carrinho
                                                    </Button>
                                                </div>
                                                <div
                                                    className="text-primaryDark cursor-pointer hover:scale-105 transition duration-300 items-center content-center
                          "
                                                >
                                                    <button
                                                        onClick={() =>
                                                            removeFromFavorite(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <BsTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 pt-2 ">
                    <p className="text-primaryDark  pt-2">Dados :</p>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4 z-10" />
                    {isEditingUser ? (
                        <form className="text-lg text-primaryDark w-[450px] bg-primary p-2 rounded-md flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium bg-gradient-to-r from-primary to-primary-light text-primaryDark "
                                    >
                                        Nome
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={userDetails.name}
                                        onChange={(e) =>
                                            setUserDetails({
                                                ...userDetails,
                                                name: e.target.value,
                                            })
                                        }
                                        className="mt-1 bg-primaryLight  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-primaryDark"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={userDetails.email}
                                        onChange={(e) =>
                                            setUserDetails({
                                                ...userDetails,
                                                email: e.target.value,
                                            })
                                        }
                                        className="mt-1  bg-primaryLight  text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-primaryDark"
                                    >
                                        Telefone
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={userDetails.phone}
                                        onBlur={(e) =>
                                            handleBlur(e.target.value)
                                        }
                                        onChange={(e) =>
                                            setUserDetails({
                                                ...userDetails,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                    />
                                    {errorMessage && (
                                        <p className="text-redAtention text-xs italic">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-primaryDark"
                                    >
                                        Sexo
                                    </label>
                                    <input
                                        id="gender"
                                        type="text"
                                        value={userDetails.gender}
                                        onChange={(e) =>
                                            setUserDetails({
                                                ...userDetails,
                                                gender: e.target.value,
                                            })
                                        }
                                        className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="birthDate"
                                        className="block text-sm font-medium text-primaryDark"
                                    >
                                        Data de nascimento
                                    </label>
                                    <input
                                        id="birthDate"
                                        type="text"
                                        value={userDetails.birthDate}
                                        onChange={(e) =>
                                            setUserDetails({
                                                ...userDetails,
                                                birthDate: e.target.value,
                                            })
                                        }
                                        className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between ">
                                <button
                                    type="button"
                                    onClick={handleCancelEditUser}
                                    className="bg-secondary text-primaryLight transition p-2 rounded hover:underline
              duration-300 hover:scale-105"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveUser}
                                    className="bg-secondary text-primaryLight transition p-2 rounded hover:underline
                  duration-300 hover:scale-105"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-2 max-w-[800px] text-primaryDark  border border-secondary p-4 rounded-md flex-1">
                            <p>
                                Nome: <strong>{userDetails.name}</strong>
                            </p>
                            <p>
                                Email: <strong>{session.user?.email}</strong>
                            </p>
                            <p>
                                Telefone: <strong>{userDetails.phone}</strong>
                            </p>
                            <p>
                                Sexo: <strong>{userDetails.gender}</strong>
                            </p>
                            <p>
                                Data de Nascimento:{' '}
                                <strong>{userDetails.birthDate}</strong>
                            </p>
                            <button
                                onClick={handleEditUser}
                                className="mt-4 bg-secondary text-primaryLight
                 hover:underline hover:scale-105 font-bold py-2 px-4 rounded shadow-lg
                 hover:shadow-xl transition duration-300"
                            >
                                Editar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between gap-2">
                <div className="mt-10">
                    <h2 className="text-xl font-bold text-primaryDark ">
                        Endereços:
                    </h2>

                    <div>
                        {isCreatingNewAddress ? (
                            <form
                                className="mt-6 space-y-4 border border-primary p-4 bg-primaryLight "
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCreateAddress();
                                }}
                            >
                                <h2 className="text-primaryLight bg-secondary p-2  space-y-4w-48 rounded whitespace-nowrap">
                                    Novo Endereço
                                </h2>
                                <div className="grid grid-cols-4 text-primaryDark gap-2">
                                    <div className="col-span-3">
                                        <label
                                            htmlFor="new-street"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            Rua
                                        </label>
                                        <input
                                            id="new-street"
                                            type="text"
                                            value={newAddress.street || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    street: e.target.value,
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="new-number"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            Número
                                        </label>
                                        <input
                                            id="new-number"
                                            type="number"
                                            value={newAddress.number || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    number: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3  text-primaryDark gap-2">
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="new-complement"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            Complemento
                                        </label>
                                        <input
                                            id="new-complement"
                                            type="text"
                                            value={newAddress.complement || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    complement: e.target.value,
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="new-zipCode"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            CEP
                                        </label>
                                        <input
                                            id="new-zipCode"
                                            type="text"
                                            value={newAddress.zipCode || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    zipCode: e.target.value,
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 text-primaryDark gap-2">
                                    <div>
                                        <label
                                            htmlFor="new-city"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            Cidade
                                        </label>
                                        <input
                                            id="new-city"
                                            type="text"
                                            value={newAddress.city || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    city: e.target.value,
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="new-state"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            Estado
                                        </label>
                                        <input
                                            id="new-state"
                                            type="text"
                                            value={newAddress.state || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    state: e.target.value,
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="new-country"
                                            className="block text-sm font-medium text-primaryDark"
                                        >
                                            País
                                        </label>
                                        <input
                                            id="new-country"
                                            type="text"
                                            value={newAddress.country || ''}
                                            onChange={(e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    country: e.target.value,
                                                })
                                            }
                                            className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-secondary text-primaryLight font-bold py-2 px-4 rounded shadow-lg 
                    transition duration-300 hover:scale-105"
                                    >
                                        Salvar Endereço
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsCreatingNewAddress(true)}
                                className="mt-6 bg-secondary text-primaryLight transition duration-300 hover:scale-105 font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-200"
                            >
                                Adicionar Novo Endereço
                            </button>
                        )}
                    </div>

                    {addresses.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {addresses.map((address, index) => (
                                <li
                                    key={index}
                                    className="border border-secondary p-4 rounded-md"
                                >
                                    {editingAddressId === address._id.value ? (
                                        <form
                                            onSubmit={() =>
                                                handleSaveAddress(address)
                                            }
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-2 text-primaryDark  ">
                                                <label
                                                    htmlFor="edit-street"
                                                    className="block text-sm font-medium text-primaryDark"
                                                >
                                                    Rua
                                                </label>
                                                <input
                                                    id="edit-street"
                                                    type="text"
                                                    value={address.props.street}
                                                    onChange={(e) =>
                                                        setAddresses(
                                                            (prevAddresses) =>
                                                                prevAddresses.map(
                                                                    (a) =>
                                                                        a._id
                                                                            .value ===
                                                                        address
                                                                            ._id
                                                                            .value
                                                                            ? {
                                                                                  ...a,
                                                                                  props: {
                                                                                      ...a.props,
                                                                                      street: e
                                                                                          .target
                                                                                          .value,
                                                                                  },
                                                                              }
                                                                            : a
                                                                )
                                                        )
                                                    }
                                                    className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                                />
                                            </div>

                                            <div className="flex justify-between gap-2 ">
                                                <div>
                                                    <label
                                                        htmlFor="edit-number"
                                                        className="block text-sm font-medium text-primaryDark"
                                                    >
                                                        Número
                                                    </label>
                                                    <input
                                                        id="edit-number"
                                                        type="number"
                                                        value={
                                                            address.props.number
                                                        }
                                                        onChange={(e) =>
                                                            setAddresses(
                                                                (
                                                                    prevAddresses
                                                                ) =>
                                                                    prevAddresses.map(
                                                                        (a) =>
                                                                            a
                                                                                ._id
                                                                                .value ===
                                                                            address
                                                                                ._id
                                                                                .value
                                                                                ? {
                                                                                      ...a,
                                                                                      props: {
                                                                                          ...a.props,
                                                                                          number: parseInt(
                                                                                              e
                                                                                                  .target
                                                                                                  .value
                                                                                          ),
                                                                                      },
                                                                                  }
                                                                                : a
                                                                    )
                                                            )
                                                        }
                                                        className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="edit-complement"
                                                        className="block text-sm font-medium text-primaryDark"
                                                    >
                                                        Complemento
                                                    </label>
                                                    <input
                                                        id="edit-complement"
                                                        type="text"
                                                        value={
                                                            address.props
                                                                .complement ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            setAddresses(
                                                                (
                                                                    prevAddresses
                                                                ) =>
                                                                    prevAddresses.map(
                                                                        (a) =>
                                                                            a
                                                                                ._id
                                                                                .value ===
                                                                            address
                                                                                ._id
                                                                                .value
                                                                                ? {
                                                                                      ...a,
                                                                                      props: {
                                                                                          ...a.props,
                                                                                          complement:
                                                                                              e
                                                                                                  .target
                                                                                                  .value,
                                                                                      },
                                                                                  }
                                                                                : a
                                                                    )
                                                            )
                                                        }
                                                        className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="edit-city"
                                                        className="block text-sm font-medium text-primaryDark"
                                                    >
                                                        Cidade
                                                    </label>
                                                    <input
                                                        id="edit-city"
                                                        type="text"
                                                        value={
                                                            address.props.city
                                                        }
                                                        onChange={(e) =>
                                                            setAddresses(
                                                                (
                                                                    prevAddresses
                                                                ) =>
                                                                    prevAddresses.map(
                                                                        (a) =>
                                                                            a
                                                                                ._id
                                                                                .value ===
                                                                            address
                                                                                ._id
                                                                                .value
                                                                                ? {
                                                                                      ...a,
                                                                                      props: {
                                                                                          ...a.props,
                                                                                          city: e
                                                                                              .target
                                                                                              .value,
                                                                                      },
                                                                                  }
                                                                                : a
                                                                    )
                                                            )
                                                        }
                                                        className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between gap-2 ">
                                                <div>
                                                    <label
                                                        htmlFor="edit-state"
                                                        className="block text-sm font-medium text-primaryDark"
                                                    >
                                                        Estado
                                                    </label>
                                                    <input
                                                        id="edit-state"
                                                        type="text"
                                                        value={
                                                            address.props.state
                                                        }
                                                        onChange={(e) =>
                                                            setAddresses(
                                                                (
                                                                    prevAddresses
                                                                ) =>
                                                                    prevAddresses.map(
                                                                        (a) =>
                                                                            a
                                                                                ._id
                                                                                .value ===
                                                                            address
                                                                                ._id
                                                                                .value
                                                                                ? {
                                                                                      ...a,
                                                                                      props: {
                                                                                          ...a.props,
                                                                                          state: e
                                                                                              .target
                                                                                              .value,
                                                                                      },
                                                                                  }
                                                                                : a
                                                                    )
                                                            )
                                                        }
                                                        className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="edit-zipCode"
                                                        className="block text-sm font-medium text-primaryDark"
                                                    >
                                                        CEP
                                                    </label>
                                                    <input
                                                        id="edit-zipCode"
                                                        type="text"
                                                        value={
                                                            address.props
                                                                .zipCode
                                                        }
                                                        onChange={(e) =>
                                                            setAddresses(
                                                                (
                                                                    prevAddresses
                                                                ) =>
                                                                    prevAddresses.map(
                                                                        (a) =>
                                                                            a
                                                                                ._id
                                                                                .value ===
                                                                            address
                                                                                ._id
                                                                                .value
                                                                                ? {
                                                                                      ...a,
                                                                                      props: {
                                                                                          ...a.props,
                                                                                          zipCode:
                                                                                              e
                                                                                                  .target
                                                                                                  .value,
                                                                                      },
                                                                                  }
                                                                                : a
                                                                    )
                                                            )
                                                        }
                                                        className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                                                    />
                                                </div>

                                                <div className="mt-8 flex justify-start mb-6">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSaveAddress(
                                                                address
                                                            )
                                                        }
                                                        className="bg-secondary text-primaryLight 
                        font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300 hover:scale-105"
                                                    >
                                                        Salvar Endereço
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className=" grid grid-cols-2 text-primaryDark ">
                                                <p>
                                                    <strong>Rua:</strong>{' '}
                                                    {address.props.street},{' '}
                                                    {address.props.number}
                                                </p>
                                                <p className="mr-4">
                                                    <strong>
                                                        Complemento:
                                                    </strong>{' '}
                                                    {address.props.complement}
                                                    {'   '}
                                                </p>
                                            </div>

                                            <div className=" grid grid-cols-4 text-primaryDark ">
                                                <p>
                                                    <strong>Cidade:</strong>{' '}
                                                    {address.props.city}
                                                </p>
                                                <p>
                                                    <strong>Estado:</strong>{' '}
                                                    {address.props.state}
                                                </p>
                                                <p>
                                                    <strong>País:</strong>{' '}
                                                    {address.props.country}
                                                </p>
                                                <p>
                                                    <strong>CEP:</strong>{' '}
                                                    {address.props.zipCode}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <button
                                                    onClick={() =>
                                                        handleEditAddress(
                                                            address._id.value
                                                        )
                                                    }
                                                    className="mt-2  bg-secondary text-primaryLight
                            
                            font-bold py-1 px-2 rounded shadow-lg transition duration-300 hover:scale-105"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteAddress(
                                                            address._id.value
                                                        )
                                                    }
                                                    className="text-primaryDark cursor-pointer transition duration-300 hover:text-primary hover:scale-105"
                                                >
                                                    <BsTrash size={24} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-6">Nenhum endereço encontrado.</p>
                    )}
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-bold text-primaryDark ">
                        Pedidos:
                    </h2>

                    {orders.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {orders.map((order, index) => (
                                <li
                                    key={index}
                                    className="border border-secondary p-4 rounded-md"
                                >
                                    <p>
                                        <strong>Pedido ID:</strong>{' '}
                                        {order._id.value}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{' '}
                                        {order.props.status}
                                    </p>
                                    <p>
                                        <strong>Data do Pagamento:</strong>{' '}
                                        {format(
                                            parseISO(order.props.paymentDate),
                                            'dd/MM/yyyy HH:mm'
                                        )}
                                    </p>
                                    <p>
                                        <strong>Método de Pagamento:</strong>{' '}
                                        {order.props.paymentMethod}
                                    </p>
                                    <p>
                                        <strong>Status do Pagamento:</strong>{' '}
                                        {order.props.paymentStatus}
                                    </p>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">
                                            Itens:
                                        </h3>
                                        <ul className="ml-4 list-disc">
                                            {order.props.items.map(
                                                (item, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-center"
                                                    >
                                                        <Image
                                                            src={
                                                                item.props
                                                                    .imageUrl
                                                            }
                                                            alt={
                                                                item.props
                                                                    .productName
                                                            }
                                                            width={50}
                                                            height={50}
                                                            className="mr-4"
                                                        />
                                                        <span>
                                                            {
                                                                item.props
                                                                    .productName
                                                            }{' '}
                                                            -{' '}
                                                            {
                                                                item.props
                                                                    .quantity
                                                            }
                                                            x - R$
                                                            {item.props.price}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-6">Nenhum pedido encontrado.</p>
                    )}
                </div>
            </div>
            <div className="mt-10 flex justify-between pb-4">
                <Link
                    href="/"
                    className="text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105"
                >
                    Voltar para Home
                </Link>
                <Link
                    href="/cart"
                    className="text-primaryLight hover:underline 
          bg-secondary p-2 rounded transition duration-300
           hover:scale-105"
                >
                    Ver Carrinho
                </Link>
            </div>
        </div>
    );
};

export default UserPage;
