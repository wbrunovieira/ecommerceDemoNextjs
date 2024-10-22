import React from 'react';

import CustomNotification from '@/components/CustomNotification';

import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { AdminPanelProps } from '../interfaces';

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
    categories,

    notification,
    setNotification,
    editingCategoryId,
    editCategoryData,
    handleCategoryInputChange,
    handleSaveCategoryClick,
    handleEditCategoryClick,
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
}) => {
    return (
        <nav className="w-full px-2 space-y-1 z-20">
            {/* Produtos */}
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
                                        onClick={() => fetchProductById(searchId)} 
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
                                                                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
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

                                {/* Edição de Produtos */}
                                {editingProductId && (
                                    <div className="mt-4 min-w-full overflow-x-hidden">
                                        <h3 className="text-lg font-medium text-primaryDark dark:text-primaryLight">
                                            Editar Produto
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 overflow-x-hidden">
                                            {/* Inputs de Edição */}
                                            <input
                                                type="text"
                                                name="name"
                                                value={editProductData.name}
                                                onChange={
                                                    handleProductInputChange
                                                }
                                                className="text-primaryDark px-4 py-1 border border-gray-300 rounded w-4/5"
                                            />
                                            {/* Outros campos de edição */}
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




            {/* Outras seções para Categorias, Cores, Tamanhos, Marcas, etc. */}
        </nav>
    );
};

export default AdminPanel;
