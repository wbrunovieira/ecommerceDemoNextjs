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
import { AdminPanelProps, Category } from '../interfaces';
import { addCategoriesToProductApi, fetchCategoriesApi } from '../apiService';
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

    colors,
    editingColorId,
    editColorData,
    handleInputChange,
    handleSaveClick,
    handleEditClick,
    sizes,
    editingSizeId,
    editSizeData,
    handleSizeInputChange,
    handleSaveSizeClick,
    handleEditSizeClick,
    brands,
    editingBrandId,
    editBrandData,
    handleBrandInputChange,
    handleSaveBrandClick,
    handleEditBrandClick,
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

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;
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

    const handleEditCategoryClick = (category: Category) => {
        console.log('Categoria a ser editada:', category);
        console.log('category._id.value', category._id.value);
        setEditingCategoryId(category._id.value);
        setEditCategoryData({
            name: category.props.name,
            imageUrl: category.props.imageUrl,
        });
    };
    console.log('Categoria em edição:', editingCategoryId);
    console.log('Categoria em edição EditCategoryData:', editCategoryData);

    const fetchCategories = useCallback(async () => {
        try {
            const fetchedCategories = await fetchCategoriesApi();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Erro ao buscar as categorias:', error);
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

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <nav className="w-full px-2 space-y-1 z-20">
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
                                    <table className="divide-y divide-gray-200 dark:divide-gray-700 ">
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
                                                message={notification.message}
                                                type={notification.type}
                                                onClose={() =>
                                                    setNotification(null)
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
                                        <h3 className="text-lg font-medium text-primaryDark dark:text-primaryLight">
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
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                                        className="text-primaryDark  px-2 py-1 border border-gray-300 rounded w-48 text-xs"
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
                                                        className="text-primaryDark px-2 py-1 border border-gray-300 rounded w-48 text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-2 p-4">
                                                <label className="block text-xl font-medium text-gray-700 dark:text-gray-300">
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
                                                                    className="text-primaryDark dark:text-primaryLight"
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
                                                    className="bg-secondary hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryLight dark:text-primaryLight mt-4 whitespace-nowrap"
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
                                            <div className="flex gap-2">
                                                <div className="w-32">
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
                                                <div className="w-32">
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
                                                <div className="w-32">
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
                                                <div className="w-32">
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
                                            </div>

                                            <div className="w-32">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
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
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
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
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
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
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
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
                                <SheetDescription></SheetDescription>
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
                                            <tr key={category._id.value}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    {category._id.value}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    {category.props.erpId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
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
                                                                    color._id
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
                                                        brand.props.imageUrl
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
