import React from 'react';

interface OrderDetailsModalProps {
    order: any | null;
    isOpen: boolean;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    isOpen,
    onClose,
}) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-primaryDark ">
                <h2 className="text-xl font-semibold mb-4">
                    Detalhes do Pedido
                </h2>
                <p>
                    <strong>ID do Pedido:</strong> {order._id.value}
                </p>
                <p>
                    <strong>Status:</strong> {order.props.status}
                </p>
                <p>
                    <strong>Método de Pagamento:</strong>{' '}
                    {order.props.paymentMethod}
                </p>
                <p>
                    <strong>Status do Pagamento:</strong>{' '}
                    {order.props.paymentStatus}
                </p>
                <p>
                    <strong>Data do Pagamento:</strong>{' '}
                    {new Date(order.props.paymentDate).toLocaleDateString()}
                </p>

                <h3 className="text-lg font-semibold mt-4">Itens:</h3>
                {order.props.items.map((item: any) => (
                    <div
                        key={item._id.value}
                        className="border-t border-gray-200 py-2"
                    >
                        <p>
                            <strong>Nome:</strong> {item.props.productName}
                        </p>
                        <p>
                            <strong>Quantidade:</strong> {item.props.quantity}
                        </p>
                        <p>
                            <strong>Preço:</strong>{' '}
                            {item.props.price.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </p>
                    </div>
                ))}

                <button
                    className="mt-4 bg-primary text-white px-4 py-2 rounded"
                    onClick={onClose}
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
