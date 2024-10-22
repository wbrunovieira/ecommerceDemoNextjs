import React from 'react';
import { BarChart, XAxis, CartesianGrid, Bar, Tooltip as ChartTooltip, Legend } from 'recharts';

const ProductTab = ({ chartData, chartConfig, orders, fetchOrderById }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Fabricante */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">Fabricante</h2>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <Bar dataKey="desktop" fill="#8884d8" />
                        <Bar dataKey="mobile" fill="#82ca9d" />
                        <ChartTooltip />
                        <Legend />
                    </BarChart>
                </div>

                {/* Cores */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">Cores</h2>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <Bar dataKey="desktop" fill="#8884d8" />
                        <Bar dataKey="mobile" fill="#82ca9d" />
                        <ChartTooltip />
                        <Legend />
                    </BarChart>
                </div>

                {/* Por Categoria */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">Por Categoria</h2>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <Bar dataKey="desktop" fill="#8884d8" />
                        <Bar dataKey="mobile" fill="#82ca9d" />
                        <ChartTooltip />
                        <Legend />
                    </BarChart>
                </div>
            </div>

            {/* Últimos Pedidos */}
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
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id.value}
                                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => fetchOrderById(order._id.value)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{order._id.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{order.props.userId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(order.props.paymentDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.items
                                            .reduce((total, item) => total + item.props.price * item.props.quantity, 0)
                                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{order.props.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-200">
                                    Nenhum pedido encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTab;
