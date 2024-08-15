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
    onAddNewAddress: (address: Partial<Address['props']>) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
    addresses,
    onClose,
    onConfirm,
    onAddNewAddress,
}) => {
    const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);
    const [newAddress, setNewAddress] = useState<Partial<Address['props']>>({});

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
                    console.log('entrou no if (response.ok');
                    const savedAddress = await response.json();
                    console.log('savedAddress', savedAddress);
                    onAddNewAddress(savedAddress);
                    setIsAddingNew(false);
                    onConfirm(savedAddress);
                    console.log('onAddNewAddress', onAddNewAddress);
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
                    // Handle CEP not found
                }
            } catch (error) {
                console.error('Error fetching address from CEP:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-xl font-bold mb-4">Endereço de Entrega</h2>
                {isAddingNew ? (
                    <div>
                        <form className="space-y-4">
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
                                className="bg-blue-500 text-white px-4 py-2 rounded"
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
                    <div>
                        {addresses.length > 0 ? (
                            <div>
                                <p className="mb-4">
                                    Selecione um endereço de entrega:
                                </p>
                                <ul>
                                    {addresses.map((address, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                                            onClick={() => onConfirm(address)}
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
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => setIsAddingNew(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Adicionar Outro Endereço
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <p className="mb-4">
                                    Você não possui nenhum endereço cadastrado.
                                    Por favor, adicione um novo endereço.
                                </p>
                                <button
                                    onClick={() => setIsAddingNew(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Adicionar Endereço
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
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
