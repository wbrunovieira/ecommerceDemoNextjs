'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

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
import CustomNotification from '@/components/CustomNotification';

interface Color {
    _id: {
        value: string;
    };
    props: {
        name: string;
        hex: string;
        erpId: string;
    };
}

interface Size {
    _id: {
        value: string;
    };
    props: {
        name: string;
        description: string;
        erpId: string;
    };
}

interface Category {
    _id: {
        value: string;
    };
    props: {
        name: string;
        imageUrl: string;
        erpId: string;
    };
}

interface Brand {
    _id: {
        value: string;
    };
    props: {
        name: string;
        imageUrl: string;
        erpId: string;
    };
}

interface Product {
    id: string;
    name: string;
    description: string;
    productColors: string[];
    productSizes: string[];
    productCategories: string[];
    productIdVariant?: string;
    slug: string;
    brandId: string;
    brand?: string;
    discount: number;
    price: number;
    finalPrice?: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    erpId?: string;
    sku?: string;
    upc?: string;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    visibility: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    productVariants: string[];
    hasVariants: boolean;
    showInSite: boolean;
    cartItems: string[];
    orderItems: string[];
    onSale: boolean;
    isNew: boolean;
    isFeatured: boolean;
    images: string[];
    stock: number;
    createdAt: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

interface Order {
    _id: {
        value: string;
    };
    props: {
        userId: string;
        items: Array<{
            _id: {
                value: string;
            };
            props: {
                orderId: string;
                productId: string;
                productName: string;
                imageUrl: string;
                quantity: number;
                price: number;
            };
        }>;
        status: string;
        paymentId: string;
        paymentStatus: string;
        paymentMethod: string;
        paymentDate: string;
    };
}

interface Customer {
    id: string;
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
}
interface NotificationState {
    message: string;
    type: 'success' | 'error';
}
const AdminPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [orders, setOrders] = useState<Order[]>([]);
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

    useEffect(() => {
        const fetchColors = async () => {
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
        };

        const fetchSizes = async () => {
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
        };

        const fetchCategories = async () => {
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
        };

        const fetchBrands = async () => {
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
        };

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/orders/all`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Erro ao buscar os pedidos: ', error);
            }
        };

        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/customers/all`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setCustomers(response.data.customers);
            } catch (error) {
                console.error('Erro ao buscar os clientes: ', error);
            }
        };

        fetchBrands();
        fetchColors();
        fetchSizes();
        fetchCategories();
        fetchOrders();
        fetchCustomers();
        fetchOrders();
    }, []);

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

    const fetchProductById = async (searchId) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/products/${searchId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
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
        const { name, value } = e.target;
        setEditProductData((prevState) => ({ ...prevState, [name]: value }));
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

    console.log('orders:', orders);

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

    const customerData = {
        labels: customers.map((customer) => customer.name),
        datasets: [
            {
                label: 'Clientes',
                data: customers.map((customer) => customer.totalSpent),
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
                <nav className=" w-full px-2 space-y-1 z-20">
                    <div className="min-w-full bg-primaryLight dark:bg-primaryDark rounded overflow-hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <button
                                onClick={() => {
                                    setIsSheetOpen(true);
                                    setCurrentView('products');
                                }}
                                className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark dark:text-primaryLight "
                            >
                                Produtos
                            </button>

                            {currentView === 'products' && (
                                <SheetContent
                                    side="special"
                                    size="special"
                                    className="min-w-full "
                                >
                                    <SheetHeader>
                                        <SheetTitle>Produtos</SheetTitle>

                                        <SheetDescription>
                                            Descrição do produto
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="w-screen flex flex-col align-center justify-center p-2 md:p-4 ">
                                        <div className="flex flex-col md:flex-row gap-2 mb-4 w-5/6 md:w-3/5">
                                            <input
                                                type="text"
                                                placeholder="Buscar por ID"
                                                value={searchId}
                                                onChange={(e) =>
                                                    setSearchId(e.target.value)
                                                }
                                                className="px-2 py-1 border border-gray-300 rounded text-primaryDark w-5/6 md:w-3/5"
                                            />
                                            <button
                                                onClick={fetchProductById}
                                                className="px-4 py-2 bg-primary text-white rounded w-5/6 md:w-auto hover:scale-105 transition duration-300 ease-in-out"
                                            >
                                                Buscar
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-2 mb-4 w-5/6 md:w-3/5">
                                            <input
                                                type="text"
                                                placeholder="Buscar por Nome"
                                                value={searchName}
                                                onChange={(e) =>
                                                    setSearchName(
                                                        e.target.value
                                                    )
                                                }
                                                className="px-2 py-1 border border-gray-300 rounded text-primaryDark w-5/6 md:w-3/5"
                                            />
                                            <button
                                                onClick={fetchProductByName}
                                                className="px-4 py-2 bg-primary text-white rounded w-5/6 md:md:w-auto hover:scale-105 transition duration-300 ease-in-out"
                                            >
                                                Buscar
                                            </button>
                                        </div>
                                        <button
                                            onClick={fetchAllProducts}
                                            className="px-4 py-2 bg-primary text-white rounded mb-2 md:mb-6 w-3/5 md:w-1/3 hover:scale-105 transition duration-300 ease-in-out whitespace-nowrap"
                                        >
                                            Buscar Todos os Produtos
                                        </button>

                                        <div className="overflow-x-auto ">
                                            <table className=" divide-y divide-gray-200 dark:divide-gray-700 ">
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
                                                            Nome
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                        >
                                                            ERP ID
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                        >
                                                            Ações
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {notification && (
                                                    <CustomNotification
                                                        message={
                                                            notification.message
                                                        }
                                                        type={notification.type}
                                                        onClose={() =>
                                                            setNotification(
                                                                null
                                                            )
                                                        }
                                                    />
                                                )}
                                                <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                                    {products.map((product) => (
                                                        <tr key={product.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                                {product.id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                                {product.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                                {product.erpId}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                                {editingProductId ===
                                                                product.id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleSaveProductClick(
                                                                                    product.id
                                                                                )
                                                                            }
                                                                            className="px-4 py-2 bg-secondary text-white rounded"
                                                                        >
                                                                            Salvar
                                                                        </button>

                                                                        <button
                                                                            onClick={
                                                                                handleCancelEdit
                                                                            }
                                                                            className=" ml-2 px-4 py-2 bg-red-500 text-white rounded"
                                                                        >
                                                                            Sair
                                                                            da
                                                                            Edição
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEditProductClick(
                                                                                product
                                                                            )
                                                                        }
                                                                        className="px-4 py-2 bg-primary text-white rounded"
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {editingProductId && (
                                            <div className="mt-4 min-w-full overflow-x-hidden">
                                                <h3 className="text-lg font-medium text-primaryDark dark:text-primaryLight">
                                                    Editar Produto
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 overflow-x-hidden">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Nome
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={
                                                                editProductData.name
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark px-4 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Descrição
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="description"
                                                            value={
                                                                editProductData.description
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Preço
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            value={
                                                                editProductData.price
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Estoque
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="stock"
                                                            disabled
                                                            value={
                                                                editProductData.stock
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Categoria
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="category"
                                                            value={editProductData.productCategories
                                                                .map(
                                                                    (
                                                                        category
                                                                    ) =>
                                                                        category.name
                                                                )
                                                                .join(', ')}
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Marca
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="brand"
                                                            disabled
                                                            value={
                                                                editProductData.brand
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Imagens
                                                        </label>

                                                        <div className="flex space-x-2 mt-2">
                                                            {editProductData.images.map(
                                                                (
                                                                    imageUrl,
                                                                    index
                                                                ) => (
                                                                    <img
                                                                        key={
                                                                            index
                                                                        }
                                                                        src={
                                                                            imageUrl
                                                                        }
                                                                        alt={`Produto imagem ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="w-16 h-16 object-cover border border-gray-300 rounded"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            ERP ID
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="erpId"
                                                            value={
                                                                editProductData.erpId
                                                            }
                                                            disabled
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Tags
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="tags"
                                                            value={editProductData.tags.join(
                                                                ', '
                                                            )}
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Título SEO
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="seoTitle"
                                                            value={
                                                                editProductData.seoTitle
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Descrição SEO
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="seoDescription"
                                                            value={
                                                                editProductData.seoDescription
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Palavras-chave SEO
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="seoKeywords"
                                                            value={
                                                                editProductData.seoKeywords
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Altura
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="height"
                                                            value={
                                                                editProductData.height
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Largura
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="width"
                                                            value={
                                                                editProductData.width
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Comprimento
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="length"
                                                            value={
                                                                editProductData.length
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Peso
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="weight"
                                                            value={
                                                                editProductData.weight
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Status
                                                        </label>
                                                        <select
                                                            name="status"
                                                            value={
                                                                editProductData.status
                                                            }
                                                            // onChange={
                                                            //     handleProductInputChange
                                                            // }
                                                            className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-4/5"
                                                        >
                                                            <option value="ACTIVE">
                                                                Ativo
                                                            </option>
                                                            <option value="INACTIVE">
                                                                Inativo
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Visibilidade
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            name="visibility"
                                                            checked={
                                                                editProductData.visibility
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Em Promoção
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            name="onSale"
                                                            checked={
                                                                editProductData.onSale
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Novo
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            name="isNew"
                                                            disabled
                                                            checked={
                                                                editProductData.isNew
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Destaque
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            name="isFeatured"
                                                            checked={
                                                                editProductData.isFeatured
                                                            }
                                                            onChange={
                                                                handleProductInputChange
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            )}
                        </Sheet>
                    </div>

                    <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <button
                                onClick={() => {
                                    setIsSheetOpen(true);
                                    setCurrentView('categories');
                                }}
                                className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark dark:text-primaryLight "
                            >
                                Categorias
                            </button>

                            {currentView === 'categories' && (
                                <SheetContent
                                    side="special"
                                    size="special"
                                    className="min-w-full "
                                >
                                    <SheetHeader>
                                        <SheetTitle>Categorias</SheetTitle>
                                        <SheetDescription>
                                            Descrição da categoria
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="w-full md:p-4">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                                        Nome
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        imagem
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        ERP ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                                {categories.map((category) => (
                                                    <tr
                                                        key={category._id.value}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {category._id.value}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingCategoryId ===
                                                            category._id
                                                                .value ? (
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={
                                                                        editCategoryData.name
                                                                    }
                                                                    onChange={
                                                                        handleCategoryInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                category.props
                                                                    .name
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingCategoryId ===
                                                            category._id
                                                                .value ? (
                                                                <input
                                                                    type="text"
                                                                    name="description"
                                                                    value={
                                                                        editCategoryData.imageUrl
                                                                    }
                                                                    onChange={
                                                                        handleCategoryInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                category.props
                                                                    .imageUrl
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {
                                                                category.props
                                                                    .erpId
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingCategoryId ===
                                                            category._id
                                                                .value ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSaveCategoryClick(
                                                                            category
                                                                                ._id
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-secondary text-white rounded"
                                                                >
                                                                    Salvar
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditCategoryClick(
                                                                            category
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-primary text-white rounded"
                                                                >
                                                                    Editar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </SheetContent>
                            )}
                        </Sheet>
                    </div>

                    <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <button
                                onClick={() => {
                                    setIsSheetOpen(true);
                                    setCurrentView('colors');
                                }}
                                className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark dark:text-primaryLight "
                            >
                                Cores
                            </button>
                            <div className=" hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2"></div>
                            {currentView === 'colors' && (
                                <SheetContent
                                    side="special"
                                    size="special"
                                    className="min-w-full "
                                >
                                    <SheetHeader>
                                        <SheetTitle>Cores</SheetTitle>
                                        <SheetDescription>
                                            Descrição das cores
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="w-full md:p-4">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                                        Nome
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        Hex
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        ERP ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                                {colors.map((color) => (
                                                    <tr key={color._id.value}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {color._id.value}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingColorId ===
                                                            color._id.value ? (
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={
                                                                        editColorData.name
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                color.props.name
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingColorId ===
                                                            color._id.value ? (
                                                                <input
                                                                    type="text"
                                                                    name="hex"
                                                                    value={
                                                                        editColorData.hex
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                color.props.hex
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {color.props.erpId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingColorId ===
                                                            color._id.value ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSaveClick(
                                                                            color
                                                                                ._id
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-secondary dark:bg-primarytext-white rounded"
                                                                >
                                                                    Salvar
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            color
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-primary dark:bg-primary text-white rounded"
                                                                >
                                                                    Editar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </SheetContent>
                            )}
                        </Sheet>
                    </div>

                    <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <button
                                onClick={() => {
                                    setIsSheetOpen(true);
                                    setCurrentView('sizes');
                                }}
                                className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark dark:text-primaryLight "
                            >
                                Tamanhos
                            </button>

                            {currentView === 'sizes' && (
                                <SheetContent
                                    side="special"
                                    size="special"
                                    className="min-w-full "
                                >
                                    <SheetHeader>
                                        <SheetTitle>Tamanhos</SheetTitle>
                                    </SheetHeader>
                                    <div className="p-4">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                                        Nome
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    ></th>

                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        ERP ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                                {sizes.map((size) => (
                                                    <tr key={size._id.value}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {size._id.value}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingSizeId ===
                                                            size._id.value ? (
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={
                                                                        editSizeData.name
                                                                    }
                                                                    onChange={
                                                                        handleSizeInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                size.props.name
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {size.props.erpId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingSizeId ===
                                                            size._id.value ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSaveSizeClick(
                                                                            size
                                                                                ._id
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-primary text-white rounded"
                                                                >
                                                                    Salvar
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditSizeClick(
                                                                            size
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-secondary text-white rounded"
                                                                >
                                                                    Editar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </SheetContent>
                            )}
                        </Sheet>
                    </div>

                    <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <button
                                onClick={() => {
                                    setIsSheetOpen(true);
                                    setCurrentView('brands');
                                }}
                                className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark dark:text-primaryLight "
                            >
                                Marcas
                            </button>
                            {currentView === 'brands' && (
                                <SheetContent
                                    side="special"
                                    size="special"
                                    className="min-w-full "
                                >
                                    <SheetHeader>
                                        <SheetTitle>Fabricantes</SheetTitle>
                                        <SheetDescription>
                                            Fabricante Descrição
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="p-4">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                                        Nome
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        Imagem
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        ERP ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"
                                                    >
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                                                {brands.map((brand) => (
                                                    <tr key={brand._id.value}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {brand._id.value}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingBrandId ===
                                                            brand._id.value ? (
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={
                                                                        editBrandData.name
                                                                    }
                                                                    onChange={
                                                                        handleBrandInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                brand.props.name
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingBrandId ===
                                                            brand._id.value ? (
                                                                <input
                                                                    type="text"
                                                                    name="imageUrl"
                                                                    value={
                                                                        editBrandData.imageUrl
                                                                    }
                                                                    onChange={
                                                                        handleBrandInputChange
                                                                    }
                                                                    className="px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                brand.props
                                                                    .imageUrl
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {brand.props.erpId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                            {editingBrandId ===
                                                            brand._id.value ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSaveBrandClick(
                                                                            brand
                                                                                ._id
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-primary text-white rounded"
                                                                >
                                                                    Salvar
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditBrandClick(
                                                                            brand
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-secondary text-white rounded"
                                                                >
                                                                    Editar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </SheetContent>
                            )}
                        </Sheet>
                    </div>
                </nav>
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
                                        <p>R$ 1.100,00</p>
                                    </CardContent>
                                    <CardFooter>
                                        <p>+ 10% que ontem</p>
                                    </CardFooter>
                                </CardS>
                                <CardS>
                                    <CardHeader>
                                        <CardTitle>
                                            Vendas essa semana
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>R$ 5.600,00</p>
                                    </CardContent>
                                    <CardFooter>
                                        <p>+ 20% que a semana anterior</p>
                                    </CardFooter>
                                </CardS>

                                <CardS>
                                    <CardHeader>
                                        <CardTitle>Vendas esse mes </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>R$ 42.100,00</p>
                                    </CardContent>
                                    <CardFooter>
                                        <p>+ 32% que o mes anterior</p>
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
