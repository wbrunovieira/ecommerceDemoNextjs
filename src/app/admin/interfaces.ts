import { Session } from 'next-auth';

export interface ItemTableProps {
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    price: number;
}

export interface OrderTableProps {
    id: string;
    userName: string;
    paymentDate: string;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    items?: ItemTableProps[];
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    cartId: string;
    customerId: string;
    items: Array<{
        productId: string;
        productName: string;
        imageUrl: string;
        quantity: number;
        price: number;
    }>;
    status: string;
    paymentId: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentDate: string;
}

export interface Color {
    _id: {
        value: string;
    };
    props: {
        name: string;
        hex: string;
        erpId: string;
    };
}

export interface Size {
    _id: {
        value: string;
    };
    props: {
        name: string;
        description: string;
        erpId: string;
    };
}

export interface Category {
    _id: {
        value: string;
    };
    props: {
        name: string;
        imageUrl: string;
        erpId: string;
    };
}

export interface Brand {
    _id: {
        value: string;
    };
    props: {
        name: string;
        imageUrl: string;
        erpId: string;
    };
}

export interface Product {
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

export interface Item {
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
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
}
export interface NotificationState {
    message: string;
    type: 'success' | 'error';
}

export interface AdminPanelProps {
    isSheetOpen: boolean;
    setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentView: string;
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
    searchId: string;
    setSearchId: React.Dispatch<React.SetStateAction<string>>;
    fetchProductById: (searchId: string) => void;
    searchName: string;
    setSearchName: React.Dispatch<React.SetStateAction<string>>;
    fetchProductByName: () => void;
    fetchAllProducts: () => void;
    products: any[];
    editingProductId: string | null;
    handleSaveProductClick: (productId: string) => void;
    handleEditProductClick: (product: any) => void;
    handleCancelEdit: () => void;
    editProductData: any;
    handleProductInputChange: (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;

    notification: any;

    setNotification: React.Dispatch<React.SetStateAction<any>>;

    editingColorId: string | null;
    editColorData: any;
  
    setSelectedCategories: any;
    selectedCategories: any;
    session: Session | null;

    status: 'loading' | 'authenticated' | 'unauthenticated';
}

export interface SalesTabProps {
    dailySales: number;
    yesterdaySales: number;
    weeklySales: number;
    lastWeekSales: number;
    monthlySales: number;
    lastMonthSales: number;
    chartData: any;
    weeklyChartData: any;
    monthlyChartData: any;
}

export interface OrderItemProps {
    orderId: string;
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: string;
    price: number;
}

export interface OrderItem {
    _id: {
        value: string;
    };
    props: OrderItemProps;
}

export interface OrderProps {
    userId: string;
    items: OrderItem[];
    status: string;
    paymentId: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentDate: string;
}

export interface OrderApi {
    _id: {
        value: string;
    };

    props: OrderProps;
}

export interface DaySalesData {
    day: string;
    sales: number;
}

export interface WeekSalesData {
    week: string;
    sales: number;
}

export interface MonthSalesData {
    month: string;
    sales: number;
}

export interface CategoryData {
    categoryName: string;
    totalValue: number;
}
export interface ProductData {
    productName: string;
    totalValue: number;
}
export interface BrandData {
    brandName: string;
    totalValue: number;
}
