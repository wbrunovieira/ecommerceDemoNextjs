import React, { useCallback, useEffect, useState } from 'react';

import CustomNotification from '@/components/CustomNotification';

import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { AdminPanelProps, Brand, Category, Color, Size } from '../interfaces';
import {
    addCategoriesToProductApi,
    fetchBrandsApi,
    fetchCategoriesApi,
    fetchColorsApi,
    fetchSizesApi,
} from '../apiService';
import axios from 'axios';

const AdminPanel: React.FC<AdminPanelProps> = ({
    isSheetOpen,
    setIsSheetOpen,
    currentView,
    setCurrentView,
    searchId,
    setSearchId,
    fetchProductById,
    searchName,
    setSearchName,
    fetchProductByName,
    fetchAllProducts,
    products,
    editingProductId,
    handleSaveProductClick,
    handleEditProductClick,
    handleCancelEdit,
    editProductData,
    handleProductInputChange,
    notification,
    setNotification,

    selectedCategories,
    setSelectedCategories,

    session,
    status,
}) => {
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
        null
    );
    const [editCategoryData, setEditCategoryData] = useState({
        name: '',
        imageUrl: '',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [editingColorId, setEditingColorId] = useState<string | null>(null);
    const [editColorData, setEditColorData] = useState({ name: '', hex: '' });

    const [sizes, setSizes] = useState<Size[]>([]);
    const [editSizeData, setEditSizeData] = useState({
        name: '',
        description: '',
    });
    const [editingSizeId, setEditingSizeId] = useState<string | null>(null);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
    const [editBrandData, setEditBrandData] = useState({
        name: '',
        imageUrl: '',
    });

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditColorData((prevState) => ({ ...prevState, [name]: value }));
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

    const handleCategoryInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setEditCategoryData((prevState) => ({ ...prevState, [name]: value }));
    };
    const handleSaveColorClick = async (colorId: string) => {
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

    const handleEditCategoryClick = (category: Category) => {
        console.log('Categoria a ser editada:', category);
        console.log('category._id.value', category._id.value);
        setEditingCategoryId(category._id.value);
        setEditCategoryData({
            name: category.props.name,
            imageUrl: category.props.imageUrl,
        });
    };

    const fetchCategories = useCallback(async () => {
        try {
            const fetchedCategories = await fetchCategoriesApi();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Erro ao buscar as categorias:', error);
        }
    }, []);

    const fetchColors = useCallback(async () => {
        try {
            const fetchedColors = await fetchColorsApi();
            setColors(fetchedColors);
        } catch (error) {
            console.error('Erro ao buscar as cores: ', error);
        }
    }, []);

    const fetchSizes = useCallback(async () => {
        try {
            const fetchedSizes = await fetchSizesApi();
            setSizes(fetchedSizes);
        } catch (error) {
            console.error('Erro ao buscar os tamanhos:', error);
        }
    }, []);

    const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditSizeData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEditSizeClick = (size: Size) => {
        setEditingSizeId(size._id.value);
        setEditSizeData({
            name: size.props.name,
            description: size.props.description,
        });
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

    const fetchBrands = useCallback(async () => {
        try {
            const fetchedBrands = await fetchBrandsApi();
            console.log('fetchedBrands', fetchedBrands);
            setBrands(fetchedBrands);
        } catch (error) {
            console.error('Erro ao buscar os fabricantes:', error);
        }
    }, []);

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

            const response = await addCategoriesToProductApi(
                productId,
                selectedCategories
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

    const handleEditColorClick = (color: Color) => {
        setEditingColorId(color._id.value);
        setEditColorData({ name: color.props.name, hex: color.props.hex });
    };

    const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditBrandData((prevState) => ({ ...prevState, [name]: value }));
    };
    const handleEditBrandClick = (brand: Brand) => {
        setEditingBrandId(brand._id.value);
        setEditBrandData({
            name: brand.props.name,
            imageUrl: brand.props.imageUrl,
        });
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

    useEffect(() => {
        fetchCategories();
        fetchColors();
        fetchSizes();
        fetchBrands();
    }, [fetchCategories, fetchBrands, fetchSizes, fetchColors]);

    return (
        <nav className="w-full px-2 space-y-1 z-20">
            <div className="min-w-full bg-primaryLight  rounded overflow-hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <button
                        onClick={() => {
                            setIsSheetOpen(true);
                            setCurrentView('products');
                        }}
                        className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  "
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
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <div className="w-screen flex flex-col align-center justify-center p-2 md:p-4">
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
                                        onClick={() =>
                                            fetchProductById(searchId)
                                        }
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
                                            setSearchName(e.target.value)
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
                                    <table className="divide-y divide-gray-200 ">
                                        <thead className="bg-primaryLight rounded">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                                >
                                                    ID
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                                >
                                                    Nome
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                                >
                                                    ERP ID
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                                >
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        {notification && (
                                            <CustomNotification
                                                message={notification.message}
                                                type={notification.type}
                                                onClose={() =>
                                                    setNotification(null)
                                                }
                                            />
                                        )}
                                        <tbody className="bg-primaryLight  divide-y divide-gray-200 ">
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                        {product.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                        {product.erpId}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
                                                                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded "
                                                                >
                                                                    Sair da
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
                                    <div className="mt-4 min-w-full overflow-x-hidden ">
                                        <h3 className="text-lg font-medium text-primaryDark ">
                                            Editar Produto
                                        </h3>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 w-4/5">
                                                <div>
                                                    <div className="flex space-x-2 mt-2">
                                                        {editProductData.images.map(
                                                            (
                                                                imageUrl,
                                                                index
                                                            ) => (
                                                                <Image
                                                                    key={index}
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={`Produto imagem ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    width={64}
                                                                    height={64}
                                                                    className="object-cover border border-gray-300 rounded"
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 overflow-x-hidden text-lg w-4/5 ">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={
                                                            editProductData.name
                                                        }
                                                        onChange={
                                                            handleProductInputChange
                                                        }
                                                        className="text-primaryDark px-4 py-1 border border-gray-300 rounded w-4/5 flex-1"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 ">
                                                    Descrição
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={
                                                        editProductData.description
                                                    }
                                                    onChange={
                                                        handleProductInputChange
                                                    }
                                                    className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-4/5 text-xs"
                                                    onInput={(e) => {
                                                        const target =
                                                            e.target as HTMLTextAreaElement;
                                                        target.style.height =
                                                            'auto';
                                                        target.style.height = `${target.scrollHeight}px`;
                                                    }}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 w-4/5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                                        className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-48 text-xs"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                                        className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-48 text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-2 p-4">
                                                <label className="block text-xl font-medium text-gray-700 ">
                                                    Categorias
                                                </label>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
                                                    {categories.map(
                                                        (category) => (
                                                            <div
                                                                key={
                                                                    category._id
                                                                        .value
                                                                }
                                                                className="flex items-center text-xs"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    id={
                                                                        category
                                                                            ._id
                                                                            .value
                                                                    }
                                                                    value={
                                                                        category
                                                                            ._id
                                                                            .value
                                                                    }
                                                                    checked={selectedCategories.includes(
                                                                        category
                                                                            ._id
                                                                            .value
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleCategorySelection(
                                                                            e,
                                                                            category
                                                                                ._id
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                <label
                                                                    htmlFor={
                                                                        category
                                                                            ._id
                                                                            .value
                                                                    }
                                                                    className="text-primaryDark "
                                                                >
                                                                    {
                                                                        category
                                                                            .props
                                                                            .name
                                                                    }
                                                                </label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <button
                                                    className="bg-secondary hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryLight mt-4 whitespace-nowrap"
                                                    onClick={() =>
                                                        handleAddCategoryToProduct(
                                                            editingProductId
                                                        )
                                                    }
                                                >
                                                    Salvar Alterações na
                                                    Categoria
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 ">
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
                                                <label className="block text-sm font-medium text-gray-700 ">
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
                                                <label className="block text-sm font-medium text-gray-700 ">
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
                                                <label className="block text-sm font-medium text-gray-700 ">
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
                                            <div className="flex gap-2">
                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                                <div className="w-32">
                                                    <label className="block text-sm font-medium text-gray-700 ">
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
                                            </div>

                                            <div className="w-32">
                                                <label className="block text-sm font-medium text-gray-700 text-gray-300">
                                                    Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={
                                                        editProductData.status
                                                    }
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

                                            <div className="flex flex-col gap-8 border-2 p-4 mt-4 rounded-lg w-3/4 md:flex-row">
                                                <div className="flex gap-1 items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="showInSite"
                                                        checked={
                                                            editProductData.showInSite
                                                        }
                                                        onChange={
                                                            handleProductInputChange
                                                        }
                                                        className="h-4 w-4"
                                                    />
                                                    <label className="block text-sm font-medium text-gray-700  whitespace-nowrap">
                                                        Dísponivel no Site
                                                    </label>
                                                </div>

                                                <div className="flex gap-1 items-center">
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
                                                    <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                                                        Em Promoção
                                                    </label>
                                                </div>
                                                <div className="flex gap-1  items-center">
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
                                                    <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                                                        Novo
                                                    </label>
                                                </div>
                                                <div className="flex gap-1  items-center">
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
                                                    <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                                                        Destaque
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-8 mr-48">
                                                <button
                                                    onClick={() =>
                                                        handleSaveProductClick(
                                                            editingProductId
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-secondary text-white rounded"
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                                                >
                                                    Sair da Edição
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    )}
                </Sheet>
            </div>

            <div className="bg-primaryLight  p-2 rounded">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <button
                        onClick={() => {
                            setIsSheetOpen(true);
                            setCurrentView('categories');
                        }}
                        className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark "
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
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <div className="w-full md:p-4">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-primaryLight  rounded">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark uppercase tracking-wider"
                                            >
                                                imagem
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ERP ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-primaryLight  divide-y divide-gray-200 ">
                                        {categories.map((category) => (
                                            <tr key={category._id.value}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {category._id.value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {editingCategoryId ===
                                                    category._id.value ? (
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
                                                        category.props.name
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {editingCategoryId ===
                                                    category._id.value ? (
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
                                                        category.props.imageUrl
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {category.props.erpId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {editingCategoryId ===
                                                    category._id.value ? (
                                                        <button
                                                            onClick={() =>
                                                                handleSaveCategoryClick(
                                                                    category._id
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

            <div className="bg-primaryLight  p-2 rounded">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <button
                        onClick={() => {
                            setIsSheetOpen(true);
                            setCurrentView('colors');
                        }}
                        className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  "
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
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <div className="w-full md:p-4">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-primaryLight  rounded">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Hex
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ERP ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-primaryLight  divide-y divide-gray-200 ">
                                        {colors.map((color) => (
                                            <tr key={color._id.value}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {color._id.value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {color.props.erpId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {editingColorId ===
                                                    color._id.value ? (
                                                        <button
                                                            onClick={() =>
                                                                handleSaveColorClick(
                                                                    color._id
                                                                        .value
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-secondary  rounded"
                                                        >
                                                            Salvar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleEditColorClick(
                                                                    color
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-primary  text-white rounded"
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

            <div className="bg-primaryLight   p-2 rounded">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <button
                        onClick={() => {
                            setIsSheetOpen(true);
                            setCurrentView('sizes');
                        }}
                        className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  "
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
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-primaryLight  rounded">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            ></th>

                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ERP ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-primaryLight  divide-y divide-gray-200 ">
                                        {sizes.map((size) => (
                                            <tr key={size._id.value}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {size._id.value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 "></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {size.props.erpId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {editingSizeId ===
                                                    size._id.value ? (
                                                        <button
                                                            onClick={() =>
                                                                handleSaveSizeClick(
                                                                    size._id
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

            <div className="bg-primaryLight  p-2 rounded">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <button
                        onClick={() => {
                            setIsSheetOpen(true);
                            setCurrentView('brands');
                        }}
                        className="hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark  "
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
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-primaryLight  rounded">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Imagem
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                ERP ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-primaryDark  uppercase tracking-wider"
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-primaryLight  divide-y divide-gray-200 ">
                                        {brands.map((brand) => (
                                            <tr key={brand._id.value}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {brand._id.value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
                                                        brand.props.imageUrl
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {brand.props.erpId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                                                    {editingBrandId ===
                                                    brand._id.value ? (
                                                        <button
                                                            onClick={() =>
                                                                handleSaveBrandClick(
                                                                    brand._id
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

            {/* Outras seções para Categorias, Cores, Tamanhos, Marcas, etc. */}
        </nav>
    );
};

export default AdminPanel;
