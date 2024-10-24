import { fetchOrdersApi, fetchOrdersIdApi } from '@/app/admin/apiService';
import OrderDetailsModal from '@/app/admin/components/OrderDetailsModal';
import { Order, OrderTableProps } from '@/app/admin/interfaces';
import React, { useEffect, useState } from 'react';

const OrdersTable: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [ordersTable, setOrdersTable] = useState<OrderTableProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mapOrdersToTableProps = (orders: Order[]): OrderTableProps[] => {
        console.log('mapOrdersToTableProps input:', orders);

        return orders.map((order) => ({
            id: order.id,
            userName: order.userName || 'Cliente não identificado',
            paymentDate: order.paymentDate
                ? new Date(order.paymentDate).toLocaleDateString()
                : 'Data indisponível',
            total: order.items.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
                0
            ),
            status: order.status || 'Status desconhecido',
            paymentStatus: order.paymentStatus || 'Pagamento desconhecido',
            paymentMethod: order.paymentMethod || 'Método não informado',
        }));
    };

    const fetchOrders = async () => {
        try {
            const orders = await fetchOrdersApi();
            console.log('fetchOrders response', orders);

            if (!Array.isArray(orders)) {
                console.error('Erro: A resposta não é um array.');
                setOrdersTable([]);
                return;
            }

            const mappedOrders = mapOrdersToTableProps(orders);
            console.log('fetchOrders mappedOrders', mappedOrders);
            setOrdersTable(mappedOrders);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            setOrdersTable([]);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrderById = async (orderId: string) => {
        try {
            const response = await fetchOrdersIdApi(orderId);
            console.log('fetchOrderById response', response);
            setSelectedOrder(response || null);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Erro ao buscar detalhes do pedido:', err);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold">Últimos Pedidos</h2>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">
                            Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">
                            Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">
                            Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">
                            Status Pagamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">
                            Método de Pagamento
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                    {ordersTable.length > 0 ? (
                        ordersTable.map((order) => (
                            <tr
                                key={order.id}
                                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                onClick={() => fetchOrderById(order.id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order.userName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order.paymentDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order.total.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order.paymentStatus}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order.paymentMethod}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-200"
                            >
                                Nenhum pedido encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default OrdersTable;
