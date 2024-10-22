import React from 'react';
import {
    CardS,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import {
    BarChart,
    XAxis,
    CartesianGrid,
    Bar,
    Tooltip as ChartTooltip,
    Legend,
} from 'recharts';
import { SalesTabProps } from '../interfaces';

const SalesTab: React.FC<SalesTabProps> = ({
    dailySales,
    orders,

    yesterdaySales,
    weeklySales,
    lastWeekSales,
    monthlySales,
    lastMonthSales,
    calculatePercentageChange,
    chartData,
    weeklyChartData,

    monthlyChartData,
    fetchOrderById,
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
                        {calculatePercentageChange(dailySales, yesterdaySales)}{' '}
                        que ontem
                    </CardFooter>
                </CardS>

                {/* Vendas da semana */}
                <CardS>
                    <CardHeader>
                        <CardTitle>Vendas essa semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {weeklySales.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </CardContent>
                    <CardFooter>
                        {calculatePercentageChange(weeklySales, lastWeekSales)}{' '}
                        que semana passada
                    </CardFooter>
                </CardS>

                {/* Vendas do mês */}
                <CardS>
                    <CardHeader>
                        <CardTitle>Vendas esse mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {monthlySales.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </CardContent>
                    <CardFooter>
                        {calculatePercentageChange(
                            monthlySales,
                            lastMonthSales
                        )}{' '}
                        que mês passado
                    </CardFooter>
                </CardS>
            </div>

            {/* Gráficos por períodos (últimos 7 dias, semanas e meses) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Vendas dos últimos 7 dias */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Vendas dos últimos 7 dias
                    </h2>
                    <BarChart width={300} height={300} data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tick={{ fontSize: 8, fill: '#FFFFFF' }}
                            tickFormatter={(value) => `Dia ${value}`}
                        />
                        <ChartTooltip />
                        <Bar
                            dataKey="sales"
                            fill="var(--color-sales)"
                            radius={4}
                        />
                        <Legend />
                    </BarChart>
                </div>

                {/* Vendas das últimas 7 semanas */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Vendas das últimas 7 semanas
                    </h2>
                    <BarChart width={300} height={300} data={weeklyChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            tick={{ fontSize: 8, fill: '#FFFFFF' }}
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip />
                        <Bar
                            dataKey="sales"
                            fill="var(--color-sales)"
                            radius={4}
                        />
                        <Legend />
                    </BarChart>
                </div>

                {/* Vendas dos últimos 7 meses */}
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Vendas dos últimos 7 meses
                    </h2>
                    <BarChart width={300} height={300} data={monthlyChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tick={{ fontSize: 8, fill: '#FFFFFF' }}
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip />
                        <Bar
                            dataKey="sales"
                            fill="var(--color-sales)"
                            radius={4}
                        />
                        <Legend />
                    </BarChart>
                </div>
            </div>

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
                                    onClick={() =>
                                        fetchOrderById(order._id.value)
                                    }
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order._id.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.userId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(
                                            order.props.paymentDate
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.items
                                            .reduce(
                                                (total, item) =>
                                                    total +
                                                    item.props.price *
                                                        item.props.quantity,
                                                0
                                            )
                                            .toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {order.props.status}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-200"
                                >
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

export default SalesTab;
