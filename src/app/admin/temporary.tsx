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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {categories.map(
                                            (category) => (
                                                <div
                                                    key={
                                                        category
                                                            ._id
                                                            .value
                                                    }
                                                    className="flex items-center"
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
                                        className="bg-secondary hover:bg-primary hover:scale-105 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2 text-primaryDark dark:text-primaryLight "
                                        onClick={() =>
                                            handleAddCategoryToProduct(
                                                editingProductId
                                            )
                                        }
                                    >
                                        Adcionar Categoria
                                    </button>
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
                                                <Image
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
                                                    width={
                                                        64
                                                    }
                                                    height={
                                                        64
                                                    }
                                                    className="object-cover border border-gray-300 rounded"
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
                                        Dísponivel no Site
                                    </label>
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