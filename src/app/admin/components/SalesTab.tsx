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

import { calculatePercentageChange, calculateSales } from '../calculate';
import axios from 'axios';

const SalesTab: React.FC<SalesTabProps> = ({
    dailySales,
    yesterdaySales,
    weeklySales,
    lastWeekSales,
    monthlySales,
    lastMonthSales,
    chartData,
    weeklyChartData,
    monthlyChartData,
}) => {
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

            <OrderTable />
        </div>
    );
};

export default SalesTab;
