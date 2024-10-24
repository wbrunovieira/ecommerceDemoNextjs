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
    fetchOrdersIdApi,
    fetchTopSellingByBrandApi,
    fetchTopSellingByCategoryApi,
    fetchTopSellingByProductApi,
} from '../apiService';
import { BrandData, CategoryData, ProductData } from '../interfaces';
import OrderTable from '@/components/OrderTable';

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

const ProductTab = ({ orders }) => {
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

              
            </div>
            <OrderTable />
        </div>
    );
};

export default ProductTab;
