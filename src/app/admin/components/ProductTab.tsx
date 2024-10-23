'use client';

import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as ChartTooltip,
    Legend,
    Label,
} from 'recharts';
import {
    fetchTopSellingByBrandApi,
    fetchTopSellingByCategoryApi,
    fetchTopSellingByProductApi,
} from '../apiService';
import { BrandData, CategoryData, ProductData } from '../interfaces';

const COLORS = [
    '#F0B1CC',
    '#c73e89',
    '#fcf3f7',
    '#a63955',
    '#FF6384',
    '#e4e4e4',
    '#FFCE56',
];

const generateColor = (index) => COLORS[index % COLORS.length];

const renderCustomizedLabel = ({ name, percent }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
};

const ProductTab = ({ orders, fetchOrderById }) => {
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [productData, setProductData] = useState<ProductData[]>([]);
    const [brandData, setBrandData] = useState<BrandData[]>([]);

    const totalValueCategory = categoryData.reduce(
        (acc, cur) => acc + cur.totalValue,
        0
    );
    const totalValueProducts = productData.reduce(
        (acc, cur) => acc + cur.totalValue,
        0
    );
    const totalValueBrand = brandData.reduce(
        (acc, cur) => acc + cur.totalValue,
        0
    );

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await fetchTopSellingByCategoryApi();
                const products = await fetchTopSellingByProductApi();
                const brands = await fetchTopSellingByBrandApi();
                console.log('products', products);

                setCategoryData(categories || []);
                setProductData(products || []);
                setBrandData(brands || []);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchData();
    }, []);

    console.log('productData', productData);
    console.log('totalValueProducts', totalValueProducts);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Vendas por Categoria
                    </h2>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart width={400} height={400}>
                                <ChartTooltip
                                    formatter={(value, name) => {
                                        const formattedValue =
                                            typeof value === 'number'
                                                ? `R$ ${value.toFixed(2)}`
                                                : value;
                                        return [formattedValue, name];
                                    }}
                                    itemStyle={{
                                        color: '#a63955',
                                        fontSize: '10px',
                                    }}
                                />
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#fcf3f7"
                                    dataKey="totalValue"
                                    nameKey="categoryName"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                    animationBegin={0}
                                    animationEasing="ease-out" 
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}

                                    {productData.map((entry, index) => (
                                        <Label
                                            key={`label-${index}`}
                                            content={({
                                                viewBox,
                                            }: {
                                                viewBox?: any;
                                            }) => {
                                                if (
                                                    !viewBox ||
                                                    typeof viewBox.cx ===
                                                        'undefined' ||
                                                    typeof viewBox.cy ===
                                                        'undefined'
                                                ) {
                                                    return null;
                                                }

                                                const { cx, cy } = viewBox;
                                                const adjustedY = cy - 120;
                                                const percent =
                                                    totalValueProducts > 0
                                                        ? entry.totalValue /
                                                          totalValueProducts
                                                        : 0;

                                                const labelText =
                                                    renderCustomizedLabel({
                                                        name: entry.productName,
                                                        percent,
                                                    });

                                                return (
                                                    <text
                                                        x={cx}
                                                        y={adjustedY}
                                                        fill="#F0B1CC"
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {labelText}
                                                    </text>
                                                );
                                            }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-xs flex text-center text-primaryLight justify-center h-200">
                            Nenhum dado de vendas por categoria encontrado.
                        </p>
                    )}
                </div>

                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Vendas por Produto
                    </h2>
                    {productData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart width={400} height={400}>
                                <ChartTooltip
                                    formatter={(value, name) => {
                                        const formattedValue =
                                            typeof value === 'number'
                                                ? `R$ ${value.toFixed(2)}`
                                                : value;
                                        return [formattedValue, name];
                                    }}
                                    itemStyle={{
                                        color: '#a63955',
                                        fontSize: '10px',
                                    }}
                                />

                                <Pie
                                    data={productData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#fcf3f7"
                                    dataKey="totalValue"
                                    nameKey="productName"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                    animationBegin={0}
                                    animationEasing="ease-out" 

                                >
                                    {productData.map((entry, index) => (
                                        <React.Fragment
                                            key={`fragment-${index}`}
                                        >
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />

                                            <Label
                                                content={({
                                                    viewBox,
                                                }: {
                                                    viewBox?: any;
                                                }) => {
                                                    if (
                                                        !viewBox ||
                                                        typeof viewBox.cx ===
                                                            'undefined' ||
                                                        typeof viewBox.cy ===
                                                            'undefined'
                                                    ) {
                                                        return null;
                                                    }

                                                    const { cx, cy } = viewBox;
                                                    const adjustedY = cy - 120;
                                                    const percent =
                                                        totalValueCategory > 0
                                                            ? entry.totalValue /
                                                              totalValueCategory
                                                            : 0;
                                                    const labelText =
                                                        renderCustomizedLabel({
                                                            name: entry.productName,
                                                            percent,
                                                        });

                                                    return (
                                                        <text
                                                            x={cx}
                                                            y={adjustedY}
                                                            fill="#fcf3f7"
                                                            textAnchor="middle"
                                                            dominantBaseline="central"
                                                            style={{
                                                                fontSize:
                                                                    '10px',
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {labelText}
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </React.Fragment>
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500">
                            Nenhum dado de vendas por categoria encontrado.
                        </p>
                    )}
                </div>

                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                        Vendas por Marca
                    </h2>
                    {brandData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart width={400} height={400}>
                                <ChartTooltip
                                    formatter={(value, name) => {
                                        const formattedValue =
                                            typeof value === 'number'
                                                ? `R$ ${value.toFixed(2)}`
                                                : value;
                                        return [formattedValue, name];
                                    }}
                                    itemStyle={{
                                        color: '#a63955',
                                        fontSize: '10px',
                                    }}
                                />
                                <Pie
                                    data={brandData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#fcf3f7"
                                    dataKey="totalValue"
                                    nameKey="brandName"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                    animationBegin={0}
                                    animationEasing="ease-out" 
                                >
                                    {brandData.map((entry, index) => (
                                        <React.Fragment
                                            key={`fragment-${index}`}
                                        >
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />

                                            <Label
                                                content={({
                                                    viewBox,
                                                }: {
                                                    viewBox?: any;
                                                }) => {
                                                    if (
                                                        !viewBox ||
                                                        typeof viewBox.cx ===
                                                            'undefined' ||
                                                        typeof viewBox.cy ===
                                                            'undefined'
                                                    ) {
                                                        return null;
                                                    }

                                                    const { cx, cy } = viewBox;
                                                    const adjustedY = cy - 120;
                                                    const percent =
                                                        totalValueBrand > 0
                                                            ? entry.totalValue /
                                                              totalValueBrand
                                                            : 0;
                                                    const labelText =
                                                        renderCustomizedLabel({
                                                            name: entry.brandName,
                                                            percent,
                                                        });

                                                    return (
                                                        <text
                                                            x={cx}
                                                            y={adjustedY}
                                                            fill="#fcf3f7"
                                                            textAnchor="middle"
                                                            dominantBaseline="central"
                                                            style={{
                                                                fontSize:
                                                                    '10px',
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {labelText}
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </React.Fragment>
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500">
                            Nenhum dado de vendas por categoria encontrado.
                        </p>
                    )}
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
        </div>
    );
};

export default ProductTab;
