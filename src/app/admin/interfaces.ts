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

export interface Order {
    _id: {
        value: string;
    };
    props: {
        userId: string;
        items: Item[];
        status: string;
        paymentId: string;
        paymentStatus: string;
        paymentMethod: string;
        paymentDate: string;
    };
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
    handleProductInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    categories: any[];
    selectedCategories: string[];
    handleCategorySelection: (
        e: React.ChangeEvent<HTMLInputElement>,
        categoryId: string
    ) => void;
    handleAddCategoryToProduct: (productId: string) => void;
    notification: any;
    setNotification: React.Dispatch<React.SetStateAction<any>>;
    editingCategoryId: string | null;
    editCategoryData: any;
    handleCategoryInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveCategoryClick: (categoryId: string) => void;
    handleEditCategoryClick: (category: any) => void;
    colors: any[];
    editingColorId: string | null;
    editColorData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveClick: (colorId: string) => void;
    handleEditClick: (color: any) => void;
    sizes: any[];
    editingSizeId: string | null;
    editSizeData: any;
    handleSizeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveSizeClick: (sizeId: string) => void;
    handleEditSizeClick: (size: any) => void;
    brands: any[];
    editingBrandId: string | null;
    editBrandData: any;
    handleBrandInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveBrandClick: (brandId: string) => void;
    handleEditBrandClick: (brand: any) => void;

    orders: Order[];
    fetchOrderById: (orderId: string) => Promise<void>;
}

export interface SalesTabProps {
    dailySales: number;
    yesterdaySales: number;
    weeklySales: number;
    lastWeekSales: number;
    monthlySales: number;
    lastMonthSales: number;
    calculatePercentageChange: (current: number, previous: number) => string;
    chartData: any[]; 
    weeklyChartData: any[]; 
    monthlyChartData: any[]; 
    orders: Order[];
    fetchOrderById: (orderId: string) => Promise<void>; 
}

export interface OrderItemProps {
    orderId: string;
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
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