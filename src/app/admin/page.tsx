'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import {
    CardS,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminMobileMenu from '@/components/MobileMenuAdm';

import {
    Brand,
    Category,
    Color,
    Customer,
    NotificationState,
    Order,
    Product,
    Size,
} from './interfaces';
import { calculatePercentageChange, calculateSales } from './calculate';
import { Sheet } from '@/components/ui/sheet';
import AdminPanel from './components/AdminPanel';

const AdminPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();

    const [dailySales, setDailySales] = useState(0);
    const [yesterdaySales, setYesterdaySales] = useState(0);
    const [weeklySales, setWeeklySales] = useState(0);
    const [lastWeekSales, setLastWeekSales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [lastMonthSales, setLastMonthSales] = useState(0);

    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [editingColorId, setEditingColorId] = useState<string | null>(null);
    const [editColorData, setEditColorData] = useState({ name: '', hex: '' });
    const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
    const [editSizeData, setEditSizeData] = useState({
        name: '',
        description: '',
    });
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
        null
    );
    const [editCategoryData, setEditCategoryData] = useState({
        name: '',
        imageUrl: '',
    });
    const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
    const [editBrandData, setEditBrandData] = useState({
        name: '',
        imageUrl: '',
    });
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

    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');

    const [currentView, setCurrentView] = useState('products');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const [notification, setNotification] = useState<NotificationState | null>(
        null
    );

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    useEffect(() => {
        if (
            status === 'authenticated' &&
            session?.user?.email !== 'admin@example.com'
        ) {
            router.push('/');
        }
    }, [session, status, router]);

    const fetchColors = useCallback(async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/colors/all?page=1&pageSize=10`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            setColors(response.data.colors);
        } catch (error) {
            console.error('Erro ao buscar as cores: ', error);
        }
    }, [BASE_URL]);

    const fetchSizes = useCallback(async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/size/all?page=1&pageSize=20`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSizes(response.data.size);
        } catch (error) {
            console.error('Erro ao buscar os tamanhos: ', error);
        }
    }, [BASE_URL]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/category/all?page=1&pageSize=50`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Erro ao buscar as categorias: ', error);
        }
    }, [BASE_URL]);

    const fetchBrands = useCallback(async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/brands/all?page=1&pageSize=10`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setBrands(response.data.brands);
        } catch (error) {
            console.error('Erro ao buscar os fabricantes: ', error);
        }
    }, [BASE_URL]);

    const fetchCustomers = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/customers/all`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data && Array.isArray(response.data.customers)) {
                setCustomers(response.data.customers);
            } else {
                console.error('Dados inesperados da API', response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar os clientes: ', error);
        }
    }, [BASE_URL]);

    useEffect(() => {
        fetchBrands();
        fetchColors();
        fetchSizes();
        fetchCategories();
        fetchCustomers();
    }, [fetchBrands, fetchColors, fetchSizes, fetchCategories, fetchCustomers]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/orders/all`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const fetchedOrders = response.data;
                setOrders(fetchedOrders);

                handleSalesCalculation(fetchedOrders);
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

    const handleEditClick = (color: Color) => {
        setEditingColorId(color._id.value);
        setEditColorData({ name: color.props.name, hex: color.props.hex });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditColorData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSaveClick = async (colorId: string) => {
        try {
            await axios.put(
                `${BASE_URL}/colors/${colorId}`,
                { name: editColorData.name, hex: editColorData.hex },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            setColors((prevColors) =>
                prevColors.map((color) =>
                    color._id.value === colorId
                        ? {
                              ...color,
                              props: { ...color.props, ...editColorData },
                          }
                        : color
                )
            );
            setEditingColorId(null);
        } catch (error) {
            console.error('Erro ao salvar a cor: ', error);
        }
    };

    const handleEditSizeClick = (size: Size) => {
        setEditingSizeId(size._id.value);
        setEditSizeData({
            name: size.props.name,
            description: size.props.description,
        });
    };

    const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditSizeData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSaveSizeClick = async (sizeId: string) => {
        try {
            await axios.put(
                `${BASE_URL}/size/${sizeId}`,
                { name: editSizeData.name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            setSizes((prevSizes) =>
                prevSizes.map((size) =>
                    size._id.value === sizeId
                        ? { ...size, props: { ...size.props, ...editSizeData } }
                        : size
                )
            );
            setEditingSizeId(null);
        } catch (error) {
            console.error('Erro ao salvar o tamanho: ', error);
        }
    };

    const handleEditCategoryClick = (category: Category) => {
        setEditingCategoryId(category._id.value);
        setEditCategoryData({
            name: category.props.name,
            imageUrl: category.props.imageUrl,
        });
    };

    const handleCategoryInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setEditCategoryData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSaveCategoryClick = async (categoryId: string) => {
        try {
            await axios.put(
                `${BASE_URL}/category/${categoryId}`,
                {
                    name: editCategoryData.name,
                    imageUrl: editCategoryData.imageUrl,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category._id.value === categoryId
                        ? {
                              ...category,
                              props: { ...category.props, ...editCategoryData },
                          }
                        : category
                )
            );
            setEditingCategoryId(null);
        } catch (error) {
            console.error('Erro ao salvar a categoria: ', error);
        }
    };

    const handleEditBrandClick = (brand: Brand) => {
        setEditingBrandId(brand._id.value);
        setEditBrandData({
            name: brand.props.name,
            imageUrl: brand.props.imageUrl,
        });
    };

    const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditBrandData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSaveBrandClick = async (brandId: string) => {
        try {
            await axios.put(
                `${BASE_URL}/brands/${brandId}`,
                { name: editBrandData.name, imageUrl: editBrandData.imageUrl },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            setBrands((prevBrands) =>
                prevBrands.map((brand) =>
                    brand._id.value === brandId
                        ? {
                              ...brand,
                              props: { ...brand.props, ...editBrandData },
                          }
                        : brand
                )
            );
            setEditingBrandId(null);
        } catch (error) {
            console.error('Erro ao salvar o fabricante: ', error);
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
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

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

    const handleAddCategoryToProduct = async (productId: string) => {
        try {
            if (selectedCategories.length === 0) {
                alert('Selecione ao menos uma categoria para adicionar!');
                return;
            }
            console.log(
                'handleAddCategoryToProduct selectedCategories',
                selectedCategories
            );
            console.log('handleAddCategoryToProduct productId', productId);

            const response = await axios.post(
                `${BASE_URL}/products/add-categories/${productId}`,

                { categories: [selectedCategories] },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer {{AUTH_TOKEN}}`,
                    },
                }
            );

            console.log('handleAddCategoryToProduct response', response);
            if (response.status === 201) {
                alert('Categoria adicionada com sucesso!');
            } else {
                alert('Falha ao adicionar categoria.');
            }
        } catch (error) {
            console.error('Error adding category to product:', error);
            alert('Erro ao adicionar categoria.');
        }
    };

    const handleCategorySelection = (e, categoryId) => {
        if (e.target.checked) {
            setSelectedCategories((prevSelected) => [
                ...prevSelected,
                categoryId,
            ]);
        } else {
            setSelectedCategories((prevSelected) =>
                prevSelected.filter((id) => id !== categoryId)
            );
        }
    };

    const orderData = {
        labels: orders
            ? orders.map((order) =>
                  new Date(order.props.paymentDate).toLocaleDateString()
              )
            : [],
        datasets: [
            {
                label: 'Pedidos',
                data: orders
                    ? orders.map((order) =>
                          order.props.items.reduce(
                              (total, item) =>
                                  total +
                                  item.props.price * item.props.quantity,
                              0
                          )
                      )
                    : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartConfig = {
        desktop: {
            label: 'Desktop',
            color: '#F0B1CC',
        },
        mobile: {
            label: 'Mobile',
            color: '#D3686C',
        },
    } satisfies ChartConfig;

    // const chartConfigCustomer = {
    //     axisLine: false,
    //     tickMargin: 10,
    // } satisfies ChartConfig;

    const customerData = {
        labels:
            customers && Array.isArray(customers)
                ? customers.map((customer) => customer.name)
                : [],
        datasets: [
            {
                label: 'Clientes',
                data:
                    customers && Array.isArray(customers)
                        ? customers.map((customer) => customer.totalSpent)
                        : [],
                backgroundColor: 'rgba(200, 10, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartData = [
        { month: 'January', desktop: 186, mobile: 80 },
        { month: 'February', desktop: 305, mobile: 200 },
        { month: 'March', desktop: 237, mobile: 120 },
        { month: 'April', desktop: 73, mobile: 190 },
        { month: 'May', desktop: 209, mobile: 130 },
        { month: 'June', desktop: 214, mobile: 140 },
    ];

    if (status === 'loading') {
        return <div>Carregando...</div>;
    }

    if (session?.user?.email !== 'admin@example.com') {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row md:min-h-screen z-20 divide-x w-full overflow-hidden">
            <div className="hidden md:flex  bg-primaryLight dark:bg-primaryDark text-primaryDark dark:text-primaryLight flex-col z-20">
                <div className="flex items-center justify-center h-16 border-b border-gray-700 z-20 ">
                    <span className="text-xl text-primaryDark dark:text-primaryLight font-semibold z-20">
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
                    categories={categories}
                    selectedCategories={selectedCategories}
                    handleCategorySelection={handleCategorySelection}
                    handleAddCategoryToProduct={handleAddCategoryToProduct}
                    notification={notification}
                    setNotification={setNotification}
                    editingCategoryId={null}
                    editCategoryData={{}}
                    handleCategoryInputChange={() => {}}
                    handleSaveCategoryClick={handleSaveCategoryClick}
                    handleEditCategoryClick={handleEditCategoryClick}
                    colors={colors}
                    editingColorId={null}
                    editColorData={{}}
                    handleInputChange={() => {}}
                    handleSaveClick={handleSaveClick}
                    handleEditClick={handleEditClick}
                    sizes={sizes}
                    editingSizeId={null}
                    editSizeData={{}}
                    handleSizeInputChange={handleSizeInputChange}
                    handleSaveSizeClick={handleSaveSizeClick}
                    handleEditSizeClick={handleEditSizeClick}
                    brands={brands}
                    editingBrandId={null}
                    editBrandData={{}}
                    handleBrandInputChange={() => {}}
                    handleSaveBrandClick={handleSaveBrandClick}
                    handleEditBrandClick={handleEditBrandClick}
                />
            </div>

            <main className=" p-8 bg-primaryLight dark:bg-primaryDark z-20  ">
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl text-primaryDark dark:text-primaryLight font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="mt-4 text-primaryDark dark:text-primaryLight mb-4">
                            Bem vindo a area de Adm do Site Stylos
                        </p>
                    </div>

                    <AdminMobileMenu
                        setCurrentView={setCurrentView}
                        setIsSheetOpen={setIsSheetOpen}
                    />
                </div>

                <div className="">
                    <Tabs defaultValue="vendas" className="w-full">
                        <TabsList>
                            <TabsTrigger value="vendas">Por Vendas</TabsTrigger>
                            <TabsTrigger value="produto">
                                Por Produto
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="vendas">
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
                                        {calculatePercentageChange(
                                            dailySales,
                                            yesterdaySales
                                        )}{' '}
                                        {dailySales > 0 && (
                                            <p>
                                                {calculatePercentageChange(
                                                    dailySales,
                                                    yesterdaySales
                                                )}{' '}
                                                que ontem
                                            </p>
                                        )}
                                    </CardFooter>
                                </CardS>
                                <CardS>
                                    <CardHeader>
                                        <CardTitle>
                                            Vendas essa semana
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            {' '}
                                            {weeklySales.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        {weeklySales > 0 && (
                                            <p>
                                                {calculatePercentageChange(
                                                    weeklySales,
                                                    lastWeekSales
                                                )}{' '}
                                                que semana passada
                                            </p>
                                        )}
                                    </CardFooter>
                                </CardS>

                                <CardS>
                                    <CardHeader>
                                        <CardTitle>Vendas esse mes </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            {monthlySales.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        {monthlySales > 0 && (
                                            <p>
                                                {calculatePercentageChange(
                                                    monthlySales,
                                                    lastMonthSales
                                                )}{' '}
                                                que mês passado
                                            </p>
                                        )}
                                    </CardFooter>
                                </CardS>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Clientes
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                fill="var(--color-desktop)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="mobile"
                                                fill="var(--color-mobile)"
                                                radius={4}
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Clientes
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                fill="var(--color-desktop)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="mobile"
                                                fill="var(--color-mobile)"
                                                radius={4}
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Visitas no site
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                fill="var(--color-desktop)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="mobile"
                                                fill="var(--color-mobile)"
                                                radius={4}
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>

                                {/* <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Gastos por Cliente
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart data={chartData}>
                                            <XAxis
                                                dataKey="name"
                                                tickLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="totalSpent"
                                                fill="rgba(200, 10, 255, 1)"
                                                radius={4}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div> */}
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold">
                                    Últimos Pedidos
                                </h2>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Cliente
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Data
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Total
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
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
                                                    onClick={() =>
                                                        fetchOrderById(
                                                            order._id.value
                                                        )
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
                                                                    item.props
                                                                        .price *
                                                                        item
                                                                            .props
                                                                            .quantity,
                                                                0
                                                            )
                                                            .toLocaleString(
                                                                'pt-BR',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        'BRL',
                                                                }
                                                            )}
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
                                        {selectedOrder && (
                                            <div className="mt-8">
                                                <h2 className="text-xl font-semibold">
                                                    Detalhes do Pedido
                                                </h2>
                                                <p>
                                                    ID:{' '}
                                                    {selectedOrder._id.value}
                                                </p>
                                                <p>
                                                    Cliente:{' '}
                                                    {selectedOrder.props.userId}
                                                </p>
                                                <p>
                                                    Data:{' '}
                                                    {new Date(
                                                        selectedOrder.props.paymentDate
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    Status:{' '}
                                                    {selectedOrder.props.status}
                                                </p>
                                                <p>
                                                    Total:{' '}
                                                    {selectedOrder.props.items
                                                        .reduce(
                                                            (total, item) =>
                                                                total +
                                                                item.props
                                                                    .price *
                                                                    item.props
                                                                        .quantity,
                                                            0
                                                        )
                                                        .toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                </p>

                                                <h3 className="text-lg font-semibold mt-4">
                                                    Itens
                                                </h3>
                                                <ul>
                                                    {selectedOrder.props.items.map(
                                                        (item) => (
                                                            <li
                                                                key={
                                                                    item._id
                                                                        .value
                                                                }
                                                            >
                                                                {
                                                                    item.props
                                                                        .productName
                                                                }{' '}
                                                                -{' '}
                                                                {
                                                                    item.props
                                                                        .quantity
                                                                }
                                                                x{' '}
                                                                {item.props.price.toLocaleString(
                                                                    'pt-BR',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'BRL',
                                                                    }
                                                                )}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        {/* {orders.map((order) => (
                                            <tr key={order._id.value}>
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
                                                                item.props
                                                                    .price *
                                                                    item.props
                                                                        .quantity,
                                                            0
                                                        )
                                                        .toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            }
                                                        )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    {order.props.status}
                                                </td>
                                            </tr>
                                        ))} */}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                        <TabsContent value="produto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Fabricante
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                fill="var(--color-desktop)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="mobile"
                                                fill="var(--color-mobile)"
                                                radius={4}
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Cores
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                fill="var(--color-desktop)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="mobile"
                                                fill="var(--color-mobile)"
                                                radius={4}
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div className="bg-primaryDark dark:bg-primaryLight p-6 rounded-lg shadow">
                                    <h2 className="text-lg text-primaryLight dark:text-primaryDark font-semibold mb-4">
                                        Por Categoria
                                    </h2>

                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-[50px] w-full"
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="desktop"
                                                fill="var(--color-desktop)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="mobile"
                                                fill="var(--color-mobile)"
                                                radius={4}
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold">
                                    Últimos Pedidos
                                </h2>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Cliente
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Data
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Total
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                        <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                            {orders && orders.length > 0 ? (
                                                orders.map((order) => (
                                                    <tr key={order._id.value}>
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
                                                                    (
                                                                        total,
                                                                        item
                                                                    ) =>
                                                                        total +
                                                                        item
                                                                            .props
                                                                            .price *
                                                                            item
                                                                                .props
                                                                                .quantity,
                                                                    0
                                                                )
                                                                .toLocaleString(
                                                                    'pt-BR',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'BRL',
                                                                    }
                                                                )}
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
                                                        Nenhum pedido
                                                        encontrado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
