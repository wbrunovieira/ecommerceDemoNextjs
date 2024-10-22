import React from 'react';
import { CardS, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { BarChart, XAxis, CartesianGrid, Bar, Tooltip as ChartTooltip, Legend } from 'recharts';

const SalesTab = ({
    dailySales,
    yesterdaySales,
    weeklySales,
    lastWeekSales,
    monthlySales,
    lastMonthSales,
    calculatePercentageChange,
    chartData,
    chartConfig,
    orders,
    fetchOrderById,
    selectedOrder,
}) => {
    return (
        <div>
            {/* Vendas por períodos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Vendas de hoje */}
                <CardS>
                    <CardHeader>
                        <CardTitle>Vendas hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dailySales.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </CardContent>
                    <CardFooter>
                        {calculatePercentageChange(dailySales, yesterdaySales)} que ontem
                    </CardFooter>
                </CardS>

                {/* Vendas da semana */}
                <CardS>
                    <CardHeader>
                        <CardTitle>Vendas essa semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {weeklySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </CardContent>
                    <CardFooter>
                        {calculatePercentageChange(weeklySales, lastWeekSales)} que semana passada
                    </CardFooter>
                </CardS>

                {/* Vendas do mês */}
                <CardS>
                    <CardHeader>
                        <CardTitle>Vendas esse mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {monthlySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </CardContent>
                    <CardFooter>
                        {calculatePercentageChange(monthlySales, lastMonthSales)} que mês passado
                    </CardFooter>
                </CardS>
            </div>

            {/* Gráficos por categoria, cores e visitas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Clientes por dispositivo */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Clientes
                    </h2>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        <Legend />
                    </BarChart>
                </div>

                {/* Visitas no site */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Visitas no site
                    </h2>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        <Legend />
                    </BarChart>
                </div>

                {/* Mais gráficos podem ser adicionados aqui */}
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
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id.value}
                                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => fetchOrderById(order._id.value)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order._id.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.userId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(order.props.paymentDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.items
                                            .reduce(
                                                (total, item) =>
                                                    total + item.props.price * item.props.quantity,
                                                0
                                            )
                                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.status}
                                    </td>
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

                {/* Detalhes do Pedido Selecionado */}
                {selectedOrder && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Detalhes do Pedido</h2>
                        <p>ID: {selectedOrder._id.value}</p>
                        <p>Cliente: {selectedOrder.props.userId}</p>
                        <p>Data: {new Date(selectedOrder.props.paymentDate).toLocaleDateString()}</p>
                        <p>Status: {selectedOrder.props.status}</p>
                        <p>
                            Total:{' '}
                            {selectedOrder.props.items
                                .reduce((total, item) => total + item.props.price * item.props.quantity, 0)
                                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>

                        <h3 className="text-lg font-semibold mt-4">Itens</h3>
                        <ul>
                            {selectedOrder.props.items.map((item) => (
                                <li key={item._id.value}>
                                    {item.props.productName} - {item.props.quantity}x{' '}
                                    {item.props.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesTab;
