import React, { useEffect, useState } from 'react';
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
import { Order, OrderTableProps, SalesTabProps } from '../interfaces';
import OrderTable from '@/components/OrderTable';
import { fetchOrdersApi } from '../apiService';
import {
    calculatePercentageChange,
    calculateSales,
    prepareLast7DaysData,
    prepareLast7MonthsData,
    prepareLast7WeeksData,
} from '../calculate';
import axios from 'axios';

const SalesTab: React.FC<SalesTabProps> = ({ordersTable}) => {
 
    const [dailySales, setDailySales] = useState(0);
    const [yesterdaySales, setYesterdaySales] = useState(0);
    const [weeklySales, setWeeklySales] = useState(0);
    const [lastWeekSales, setLastWeekSales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [lastMonthSales, setLastMonthSales] = useState(0);

    const [chartData, setChartData] = useState<any[]>([]);
    const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
    const [monthlyChartData, setMonthlyChartData] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const fetchOrderById = async (orderId: string) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/orders/order/${orderId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSelectedOrder(response.data);
        } catch (err) {
            console.error('Erro ao buscar detalhes do pedido:', err);
        }
    };

    const handleSalesCalculation = (orders: Order[]) => {
        const {
            dayTotal,
            yesterdayTotal,
            weekTotal,
            lastWeekTotal,
            monthTotal,
            lastMonthTotal,
        } = calculateSales(orders);

        setDailySales(dayTotal);
        setYesterdaySales(yesterdayTotal);
        setWeeklySales(weekTotal);
        setLastWeekSales(lastWeekTotal);
        setMonthlySales(monthTotal);
        setLastMonthSales(lastMonthTotal);
    };

    const mapOrdersToTableProps = (orders: Order[]): OrderTableProps[] => {
        return orders.map((order) => ({
            id: order.id,
            userName: order.userName,
            paymentDate: new Date(order.paymentDate).toLocaleDateString(),
            total: order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
        }));
    };

    const mapOrdersResponse = (response: any): Order[] => {
        return response.map((order: any) => ({
            _id: order._id,
            props: {
                userId: order.props.userId,
                items: order.props.items.map((item: any) => ({
                    _id: item._id,
                    props: {
                        orderId: item.props.orderId,
                        productId: item.props.productId,
                        productName: item.props.productName,
                        imageUrl: item.props.imageUrl,
                        quantity: item.props.quantity,
                        price: item.props.price,
                    },
                })),
                status: order.props.status,
                paymentId: order.props.paymentId,
                paymentStatus: order.props.paymentStatus,
                paymentMethod: order.props.paymentMethod,
                paymentDate: order.props.paymentDate,
            },
        }));
    };

  

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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

            <OrderTable ordersTable={ordersTable} fetchOrderById={fetchOrderById} />
        </div>
    );
};

export default SalesTab;
