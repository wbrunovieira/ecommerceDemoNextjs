import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

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

interface AddressModalProps {
    addresses: Address[];
    onClose: () => void;
    onConfirm: (address: Address) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
    addresses,
    onClose,
    onConfirm,
}) => {
    const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);
    const [newAddress, setNewAddress] = useState<Partial<Address['props']>>({});
    const [cepError, setCepError] = useState<string | null>(null);

    const { data: session } = useSession();

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const handleAddNewAddress = async () => {
        if (
            newAddress.street &&
            newAddress.number &&
            newAddress.city &&
            newAddress.state &&
            newAddress.country &&
            newAddress.zipCode
        ) {
            try {
                const id = session?.user.id;
                const response = await fetch(
                    `${BASE_URL}/adress/${id}/addresses`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                        body: JSON.stringify({
                            userId: id,
                            street: newAddress.street,
                            number: newAddress.number,
                            complement: newAddress.complement,
                            city: newAddress.city,
                            state: newAddress.state,
                            country: 'Brasil',
                            zipCode: newAddress.zipCode,
                        }),
                    }
                );
                console.log('responsehandleAddNewAddress', response);

                if (response.ok) {
                    const data = await response.json();
                    const savedAddress = data.address;
                    console.log('entrou no if (response.ok');

                    console.log('savedAddressa', savedAddress);
                    setNewAddress({});
                    setIsAddingNew(false);
                    onConfirm(savedAddress);
                    onClose();

                    console.log('addresses', addresses);
                } else {
                    console.error('Failed to save address');
                }
            } catch (error) {
                console.error('Error saving address:', error);
            }
        } else {
            // Show error message or handle validation
        }
    };

    console.log('viacep out newAddress', newAddress);

    const handleCepChange = async (cep: string) => {
        console.log('entrou handleCepChange');
        const cleanedCep = cep.replace(/\D/g, '');
        console.log('entrou handleCepChange cleanedCep', cleanedCep);
        setNewAddress((prevAddress) => ({
            ...prevAddress,
            zipCode: cleanedCep,
        }));

        setCepError(null);

        if (cleanedCep.length === 8) {
            try {
                const response = await fetch(
                    `https://viacep.com.br/ws/${cleanedCep}/json/`
                );
                const data = await response.json();
                console.log('viacep in newAddress', data);
                if (!data.erro) {
                    setNewAddress((prevAddress) => ({
                        ...prevAddress,
                        street: data.logradouro,
                        complement: data.complemento,
                        city: data.localidade,
                        state: data.uf,
                        country: 'Brasil',
                    }));
                } else {
                    setCepError(
                        'CEP não encontrado. Por favor, verifique o número e tente novamente.'
                    );
                }
            } catch (error) {
                console.error('Error fetching address from CEP:', error);
                setCepError(
                    'Erro ao buscar o endereço. Tente novamente mais tarde.'
                );
            }
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-primary bg-opacity-70 flex items-center justify-center z-50 max-w-full w-full ">
            <div className="md:flex items-center justify-center bg-white rounded-lg p-4 md:p-16 w-full h-full max-w-full m-8 overflow-auto max-w-full md:w-3/5">
                <h2 className="text-xl text-primary font-bold mb-4 p-4">
                    Onde vamos entregar?
                </h2>
                {isAddingNew ? (
                    <div>
                        <form className="space-y-4 w-full p-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    CEP
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.zipCode || ''}
                                    onChange={(e) =>
                                        handleCepChange(e.target.value)
                                    }
                                />
                                {cepError && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {cepError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rua
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.street || ''}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            street: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Número
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.number || ''}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            number: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Complemento
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.complement || ''}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            complement: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.city || ''}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            city: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.state || ''}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            state: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    País
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newAddress.country || 'Brasil'}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            country: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </form>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleAddNewAddress}
                                className="bg-primaryDark text-white px-4 py-2 rounded"
                            >
                                Salvar Endereço
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        {addresses.length > 0 ? (
                            <div className="w-full max-w-full">
                                <p className="mb-4 text-[0.7rem] md:text-base text-primaryDark font-bold whitespace-nowrap">
                                    Selecione um endereço de entrega:
                                </p>
                                <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
                                <ul className="w-full space-y-2">
                                    {addresses.map((address, index) => (
                                        <li
                                            key={index}
                                            className="p-2 rounded border border-primaryDark text-primaryDark hover:bg-primary cursor-pointer transition"
                                            onClick={() => {
                                                onConfirm(address);
                                                console.log('Chamando onClose');
                                                onClose;
                                            }}
                                        >
                                            {address.props.street},{' '}
                                            {address.props.number},{' '}
                                            {address.props.city},{' '}
                                            {address.props.state},{' '}
                                            {address.props.country} -{' '}
                                            {address.props.zipCode}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-col md:flex-rowjustify-between gap-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setIsAddingNew(true);
                                        }}
                                        className="bg-primaryDark text-white px-4 py-2 rounded transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out whitespace-nowrap"
                                    >
                                        Adicionar Outro Endereço
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-secondary text-white px-4 py-2 rounded transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex  gap-4">
                                <p className="mb-4">
                                    Você não possui nenhum endereço cadastrado.
                                    Por favor, adicione um novo endereço.
                                </p>
                                <button
                                    onClick={() => setIsAddingNew(true)}
                                    className="bg-primaryDark text-white px-4 py-2 rounded transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
                                >
                                    Adicionar Endereço
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded transform hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default AddressModal;
