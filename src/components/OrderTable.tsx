import { OrderTableProps } from '@/app/admin/interfaces';
import React from 'react';

interface OrdersTableProps {
    orders: OrderTableProps[];
    fetchOrderById: (id: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ ordersTable, fetchOrderById }) => {
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
                    {orders && orders.length > 0 ? (
                        orders.map((order) => (
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
                                    {new Date(order.paymentDate).toLocaleDateString()}
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
        </div>
    );
};

export default OrdersTable;
