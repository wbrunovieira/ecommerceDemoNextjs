'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminMobileMenu from '@/components/MobileMenuAdm';

import {
    Brand,
    Customer,
    NotificationState,
    Order,
    Product,
} from './interfaces';

import AdminPanel from './components/AdminPanel';
import SalesTab from './components/SalesTab';
import ProductTab from './components/ProductTab';
import {
    fetchBrandsApi,
    fetchCustomersApi,
    fetchOrdersApi,
} from './apiService';
import {
    calculateSales,
    prepareLast7DaysData,
    prepareLast7MonthsData,
    prepareLast7WeeksData,
} from './calculate';

const AdminPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();
    const [currentView, setCurrentView] = useState('products');
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [products, setProducts] = useState<Product[]>([]);

    const [orders, setOrders] = useState<Order[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const [chartData, setChartData] = useState<any[]>([]);
    const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
    const [monthlyChartData, setMonthlyChartData] = useState<any[]>([]);

    const [dailySales, setDailySales] = useState(0);
    const [yesterdaySales, setYesterdaySales] = useState(0);
    const [weeklySales, setWeeklySales] = useState(0);
    const [lastWeekSales, setLastWeekSales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [lastMonthSales, setLastMonthSales] = useState(0);

    const [notification, setNotification] = useState<NotificationState | null>(
        null
    );
    const [editingProductId, setEditingProductId] = useState<string | null>(
        null
    );

    const [editProductData, setEditProductData] = useState<Product>({
        id: '',
        name: '',
        description: '',
        productColors: [],
        productSizes: [],
        productCategories: [],
        productIdVariant: '',
        slug: '',
        brandId: '',
        brand: '',
        discount: 0,
        price: 0,
        finalPrice: 0,
        height: 0,
        width: 0,
        length: 0,
        weight: 0,
        erpId: '',
        sku: '',
        upc: '',
        tags: [],
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        visibility: true,
        status: 'ACTIVE',
        productVariants: [],
        hasVariants: false,
        showInSite: true,
        cartItems: [],
        orderItems: [],
        onSale: false,
        isNew: false,
        isFeatured: false,
        images: [],
        stock: 0,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
    });

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        if (
            status === 'authenticated' &&
            session?.user?.email !== 'admin@example.com'
        ) {
            router.push('/');
        }
    }, [session, status, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetchOrdersApi();
                console.log('page fetchOrders response', response);
                const mappedOrders = mapOrdersResponse(response);
                console.log('page fetchOrders mappedOrders', mappedOrders);

                setOrders(mappedOrders);

                const last7DaysData = prepareLast7DaysData(mappedOrders);
                const last7WeeksData = prepareLast7WeeksData(mappedOrders);
                const last7MonthsData = prepareLast7MonthsData(mappedOrders);
                console.log('last7DaysData ', last7DaysData);
                console.log('last7WeeksData ', last7WeeksData);
                console.log('last7MonthsData ', last7MonthsData);

                setChartData(last7DaysData);
                setWeeklyChartData(last7WeeksData);
                setMonthlyChartData(last7MonthsData);

                handleSalesCalculation(mappedOrders);
            } catch (err) {
                console.error('Erro ao buscar pedidos:', err);
            }
        };

        fetchOrders();
    }, [BASE_URL]);

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

    const mapOrdersResponse = (response: any): Order[] => {
        console.log('mapOrdersResponse inside response', response);
        return response.map((order: any) => ({
            id: order.id,
            userId: order.userId,
            userName: order.userName,
            cartId: order.cartId,
            customerId: order.customerId,
            items: order.items.map((item: any) => ({
                orderId: item.orderId,
                productId: item.productId,
                productName: item.productName,
                imageUrl: item.imageUrl,
                quantity: item.quantity,
                price: item.price,
            })),
            status: order.status,
            paymentId: order.paymentId,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            paymentDate: order.paymentDate,
        }));
    };

    const fetchCustomers = useCallback(async () => {
        try {
            const fetchedCustomers = await fetchCustomersApi();
            setCustomers(fetchedCustomers);
        } catch (error) {
            console.error('Erro ao buscar os clientes:', error);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleEditProductClick = async (product) => {
        try {
            const productData = await fetchProductById(product.id);

            if (productData) {
                setEditProductData({
                    id: productData.id,
                    name: productData.name,
                    description: productData.description,
                    productColors: productData.productColors || [],
                    productSizes: productData.productSizes || [],
                    productCategories: productData.productCategories || [],
                    productIdVariant: productData.productIdVariant || '',
                    slug: productData.slug || '',
                    brandId: productData.brandId || '',
                    brand: productData.brand || '',
                    discount: productData.discount || 0,
                    price: productData.price || 0,
                    finalPrice: productData.finalPrice || 0,
                    height: productData.height || 0,
                    width: productData.width || 0,
                    length: productData.length || 0,
                    weight: productData.weight || 0,
                    erpId: productData.erpId || '',
                    sku: productData.sku || '',
                    upc: productData.upc || '',
                    tags: productData.tags || [],
                    seoTitle: productData.seoTitle || '',
                    seoDescription: productData.seoDescription || '',
                    seoKeywords: productData.seoKeywords || '',
                    visibility:
                        productData.visibility !== undefined
                            ? productData.visibility
                            : true,
                    status: productData.status || 'ACTIVE',
                    productVariants: productData.productVariants || [],
                    hasVariants: productData.hasVariants || false,
                    showInSite:
                        productData.showInSite !== undefined
                            ? productData.showInSite
                            : true,
                    cartItems: productData.cartItems || [],
                    orderItems: productData.orderItems || [],
                    onSale:
                        productData.onSale !== undefined
                            ? productData.onSale
                            : false,
                    isNew:
                        productData.isNew !== undefined
                            ? productData.isNew
                            : false,
                    isFeatured:
                        productData.isFeatured !== undefined
                            ? productData.isFeatured
                            : false,
                    images: productData.images || [],
                    stock: productData.stock || 0,
                    createdAt: productData.createdAt
                        ? new Date(productData.createdAt)
                        : new Date(),
                    updatedAt: productData.updatedAt
                        ? new Date(productData.updatedAt)
                        : null,
                    deletedAt: productData.deletedAt
                        ? new Date(productData.deletedAt)
                        : null,
                });
                setEditingProductId(productData.id);

                // setIsSheetOpen(true);
            } else {
                console.error('Produto não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar o produto:', error);
        }
    };

    const normalizeProduct = (data: any): Product | null => {
        if (data.props) {
            const product = data.props.product || data;
            return {
                id: product._id?.value || '',
                name: product.props.name || '',
                description: product.props.description || '',
                productColors: product.props.productColors || [],
                productSizes: product.props.productSizes || [],
                productCategories: product.props.productCategories || [],
                productIdVariant: product.props.productIdVariant || '',
                slug: product.props.slug || '',
                brandId: product.props.brandId || '',
                brand: product.props.brandName || '',
                discount: product.props.discount || 0,
                price: product.props.price || 0,
                finalPrice: product.props.finalPrice || 0,
                height: product.props.height || 0,
                width: product.props.width || 0,
                length: product.props.length || 0,
                weight: product.props.weight || 0,
                erpId: product.props.sku || '',
                sku: product.props.sku || '',
                upc: product.props.upc || '',
                tags: product.props.tags || [],
                seoTitle: product.props.seoTitle || '',
                seoDescription: product.props.seoDescription || '',
                seoKeywords: product.props.seoKeywords || '',
                visibility:
                    product.props.visibility !== undefined
                        ? product.props.visibility
                        : true,
                status: product.props.status || 'ACTIVE',
                productVariants: product.props.productVariants || [],
                hasVariants: product.props.hasVariants || false,
                showInSite:
                    product.props.showInSite !== undefined
                        ? product.props.showInSite
                        : true,
                cartItems: product.props.cartItems || [],
                orderItems: product.props.orderItems || [],
                onSale:
                    product.props.onSale !== undefined
                        ? product.props.onSale
                        : false,
                isNew:
                    product.props.isNew !== undefined
                        ? product.props.isNew
                        : false,
                isFeatured:
                    product.props.isFeatured !== undefined
                        ? product.props.isFeatured
                        : false,
                images: product.props.images || [],
                stock: product.props.stock || 0,
                createdAt: product.props.createdAt
                    ? new Date(product.props.createdAt)
                    : new Date(),
                updatedAt: product.props.updatedAt
                    ? new Date(product.props.updatedAt)
                    : null,
                deletedAt: product.props.deletedAt
                    ? new Date(product.props.deletedAt)
                    : null,
            };
        } else if (data.id) {
            return data as Product;
        }
        return null;
    };

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/all`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('adm page fetchAllProducts response', response);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Erro ao buscar todos os produtos: ', error);
        }
    };

    const fetchProductById = async (searchId: string) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/products/${searchId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            const product = normalizeProduct(response.data.product);
            if (product) {
                setProducts([product]);
            }
            setSearchId('');
            return product ? product : null;
        } catch (error) {
            console.error('Erro ao buscar produto por ID: ', error);
        }
    };

    const fetchProductByName = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/products/search?name=${searchName}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const normalizedProducts = response.data.products
                .map((product: any): Product | null =>
                    normalizeProduct(product)
                )
                .filter(
                    (product: Product | null): product is Product =>
                        product !== null
                );

            setProducts(normalizedProducts);

            setSearchName('');
        } catch (error) {
            console.error('Erro ao buscar produto por nome: ', error);
        }
    };

    const handleProductInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        const newValue =
            e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
                ? e.target.checked
                : value;

        setEditProductData((prevState) => ({ ...prevState, [name]: newValue }));
    };

    const handleSaveProductClick = async (productId: string) => {
        try {
            await axios.put(
                `${BASE_URL}/products/save/${productId}`,
                { ...editProductData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, ...editProductData }
                        : product
                )
            );
            setEditingProductId(null);
            setNotification({
                message: 'Produto alterado com sucesso!',
                type: 'success',
            });
        } catch (error) {
            console.error('Erro ao salvar o produto: ', error);
            setNotification({
                message: 'Erro ao salvar o produto',
                type: 'error',
            });
        }
    };

    const handleCancelEdit = () => {
        setEditProductData({
            id: '',
            name: '',
            description: '',
            productColors: [],
            productSizes: [],
            productCategories: [],
            productIdVariant: '',
            slug: '',
            brandId: '',
            brand: '',
            discount: 0,
            price: 0,
            finalPrice: 0,
            height: 0,
            width: 0,
            length: 0,
            weight: 0,
            erpId: '',
            sku: '',
            upc: '',
            tags: [],
            seoTitle: '',
            seoDescription: '',
            seoKeywords: '',
            visibility: true,
            status: 'ACTIVE',
            productVariants: [],
            hasVariants: false,
            showInSite: true,
            cartItems: [],
            orderItems: [],
            onSale: false,
            isNew: false,
            isFeatured: false,
            images: [],
            stock: 0,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
        });

        setEditingProductId(null);
        setProducts([]);
    };

    if (status === 'loading') {
        return <div>Carregando...</div>;
    }

    if (session?.user?.email !== 'admin@example.com') {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row md:min-h-screen z-20 divide-x w-full overflow-hidden">
            <div className="hidden md:flex  bg-primaryLight  text-primaryDark  flex-col z-20">
                <div className="flex items-center justify-center h-16 border-b border-gray-700 z-20 ">
                    <span className="text-xl text-primaryDark  font-semibold z-20">
                        Admin
                    </span>
                </div>
                <AdminPanel
                    isSheetOpen={isSheetOpen}
                    setIsSheetOpen={setIsSheetOpen}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    searchId={searchId}
                    setSearchId={setSearchId}
                    fetchProductById={fetchProductById}
                    searchName={searchName}
                    setSearchName={setSearchName}
                    fetchProductByName={fetchProductByName}
                    fetchAllProducts={fetchAllProducts}
                    products={products}
                    editingProductId={editingProductId}
                    handleSaveProductClick={handleSaveProductClick}
                    handleEditProductClick={handleEditProductClick}
                    handleCancelEdit={handleCancelEdit}
                    editProductData={editProductData}
                    handleProductInputChange={handleProductInputChange}
                    notification={notification}
                    setNotification={setNotification}
                    session={session}
                    status={status}
                    editingColorId={null}
                    editColorData={{}}
                    setSelectedCategories={setSelectedCategories}
                    selectedCategories={selectedCategories}
                />
            </div>

            <main className=" p-8 bg-primaryLight  z-20  ">
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl text-primaryDark font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="mt-4 text-primaryDark  mb-4">
                            Bem vindo a area de Adm do Site Stylos
                        </p>
                    </div>

                    <AdminMobileMenu
                        setCurrentView={setCurrentView}
                        setIsSheetOpen={setIsSheetOpen}
                    />
                </div>

                <div>
                    <Tabs defaultValue="vendas" className="w-full">
                        <TabsList>
                            <TabsTrigger value="vendas">Por Vendas</TabsTrigger>
                            <TabsTrigger value="produto">
                                Por Produto
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="vendas">
                            <SalesTab
                                dailySales={dailySales}
                                yesterdaySales={yesterdaySales}
                                weeklySales={weeklySales}
                                lastWeekSales={lastWeekSales}
                                monthlySales={monthlySales}
                                lastMonthSales={lastMonthSales}
                                chartData={chartData}
                                weeklyChartData={weeklyChartData}
                                monthlyChartData={monthlyChartData}
                            />
                        </TabsContent>
                        <TabsContent value="produto">
                            <ProductTab orders={orders} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
