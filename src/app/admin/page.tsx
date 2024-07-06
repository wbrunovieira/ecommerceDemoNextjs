"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  price: number;
  stock: number;
  category: string;
  brand: string;
  imageUrl: string;
  erpId: string;
}

const AdminPage: React.FC = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [editColorData, setEditColorData] = useState({ name: "", hex: "" });
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
  const [editSizeData, setEditSizeData] = useState({ name: "", description: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryData, setEditCategoryData] = useState({ name: "", imageUrl: "" });
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editBrandData, setEditBrandData] = useState({ name: "", imageUrl: "" });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductData, setEditProductData] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    brand: "",
    imageUrl: "",
    erpId: ""
  });

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
 
  console.log('colors',colors)
  console.log('sizes',sizes)
  console.log('categories',categories)
  console.log('brands',brands)
  console.log('products',products)
  

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email !== "admin@example.com"
    ) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        console.log('entrou no fech colors')
       
       
        const response = await axios.get(`http://localhost:3333/colors/all?page=1&pageSize=10`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('response.data.colors',response.data.colors)
        setColors(response.data.colors);
      } catch (error) {
        console.error("Erro ao buscar as cores: ", error);
      }
    };

    const fetchSizes = async () => {
      try {

        console.log('entrou no fetchSizes', )
        const response = await axios.get(`http://localhost:3333/size/all?page=1&pageSize=20`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('response.data.sizes',response.data.size)
        setSizes(response.data.size);
      } catch (error) {
        console.error("Erro ao buscar os tamanhos: ", error);
      }
    };

      const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/category/all?page=1&pageSize=50`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('response.data.categories',response.data.categories)
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Erro ao buscar as categorias: ", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/brands/all?page=1&pageSize=10`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setBrands(response.data.brands);
      } catch (error) {
        console.error("Erro ao buscar os fabricantes: ", error);
      }
    };

    fetchBrands()
    fetchColors();
    fetchSizes();
    fetchCategories()
  }, []);

  const handleEditClick = (color: Color) => {
    setEditingColorId(color._id.value);
    setEditColorData({ name: color.props.name, hex: color.props.hex });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditColorData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveClick = async (colorId: string) => {
    try {
      await axios.put(
        `http://localhost:3333/colors/${colorId}`,
        { name: editColorData.name, hex: editColorData.hex },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      setColors(prevColors => prevColors.map(color => 
        color._id.value === colorId ? { ...color, props: { ...color.props, ...editColorData } } : color
      ));
      setEditingColorId(null);
    } catch (error) {
      console.error("Erro ao salvar a cor: ", error);
    }
  };

  const handleEditSizeClick = (size: Size) => {
    setEditingSizeId(size._id.value);
    setEditSizeData({ name: size.props.name, description: size.props.description });
  };

  const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditSizeData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveSizeClick = async (sizeId: string) => {
    try {
      await axios.put(
        `http://localhost:3333/size/${sizeId}`,
        { name: editSizeData.name},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      setSizes(prevSizes => prevSizes.map(size => 
        size._id.value === sizeId ? { ...size, props: { ...size.props, ...editSizeData } } : size
      ));
      setEditingSizeId(null);
    } catch (error) {
      console.error("Erro ao salvar o tamanho: ", error);
    }
  }

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategoryId(category._id.value);
    setEditCategoryData({ name: category.props.name, imageUrl: category.props.imageUrl });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditCategoryData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveCategoryClick = async (categoryId: string) => {
    try {
      await axios.put(
        `http://localhost:3333/category/${categoryId}`,
        { name: editCategoryData.name, imageUrl: editCategoryData.imageUrl},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      setCategories(prevCategories => prevCategories.map(category => 
        category._id.value === categoryId ? { ...category, props: { ...category.props, ...editCategoryData } } : category
      ));
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Erro ao salvar a categoria: ", error);
    }
  };

  const handleEditBrandClick = (brand: Brand) => {
    setEditingBrandId(brand._id.value);
    setEditBrandData({ name: brand.props.name, imageUrl: brand.props.imageUrl });
  };

  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditBrandData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveBrandClick = async (brandId: string) => {
    try {
      await axios.put(
        `http://localhost:3333/brands/${brandId}`,
        { name: editBrandData.name, imageUrl: editBrandData.imageUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      setBrands(prevBrands => prevBrands.map(brand => 
        brand._id.value === brandId ? { ...brand, props: { ...brand.props, ...editBrandData } } : brand
      ));
      setEditingBrandId(null);
    } catch (error) {
      console.error("Erro ao salvar o fabricante: ", error);
    }
  };

 const normalizeProduct = (data: any): Product | null => {
  console.log('data', data);
  if (data.props) {
    if (data.props.product) {
      
      return {
        id: data.props.product._id.value,
        name: data.props.product.props.name,
        description: data.props.product.props.description,
        price: data.props.product.props.price,
        stock: data.props.product.props.stock,
        category: data.props.product.props.productCategories?.[0]?.name || '',
        brand: data.props.product.props.brandName,
        imageUrl: data.props.product.props.images?.[0] || '',
        erpId: data.props.product.props.sku
      };
    } else {
      
      return {
        id: data._id.value,
        name: data.props.name,
        description: data.props.description,
        price: data.props.price,
        stock: data.props.stock,
        category: data.props.productCategories?.[0]?.name || '',
        brand: data.props.brandName,
        imageUrl: data.props.images?.[0] || '',
        erpId: data.props.sku
      };
    }
  } else if (data.id) {
    return data as Product;
  }
  return null;
};


  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/products/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Erro ao buscar todos os produtos: ", error);
    }
  };

  const fetchProductById = async () => {
    try {
      const response = await axios.get(`http://localhost:3333/products/${searchId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const product = normalizeProduct(response.data.product);
      if (product) {
        setProducts([product]);
      }
      setSearchId('');
    } catch (error) {
      console.error("Erro ao buscar produto por ID: ", error);
    }
  };

  const fetchProductByName = async () => {
    try {
      console.log('searchName',searchName)
      const response = await axios.get(`http://localhost:3333/products/search?name=${searchName}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('searchName response',response.data.products)
      const normalizedProducts = response.data.products.map((product: any): Product | null => normalizeProduct(product))
      .filter((product: Product | null): product is Product => product !== null);
      console.log('normalizedProducts depois do map',normalizedProducts)
      setProducts(normalizedProducts);

      setSearchName('');
    } catch (error) {
      console.error("Erro ao buscar produto por nome: ", error);
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProductId(product.id);
    setEditProductData({ ...product });
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProductData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveProductClick = async (productId: string) => {
    try {
      await axios.put(
        `http://localhost:3333/products/${productId}`,
        { ...editProductData },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      );
      setProducts(prevProducts => prevProducts.map(product => 
        product.id === productId ? { ...product, ...editProductData } : product
      ));
      setEditingProductId(null);
    } catch (error) {
      console.error("Erro ao salvar o produto: ", error);
    }
  };


  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (session?.user?.email !== "admin@example.com") {
    return null;
  }

  return (
    <div className="flex min-h-screen z-20 divide-x">
      <div className="w-64 bg-primaryLight dark:bg-primaryDark text-primaryDark dark:text-primaryLight  flex flex-col z-20 ">
        <div className="flex items-center justify-center h-16 border-b border-gray-700 z-20 ">
          <span className="text-xl text-primaryDark dark:text-primaryLight font-semibold z-20">Admin</span>
        </div>
        <nav className="flex-1 px-2 space-y-1 z-20">


     <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded ">
            <Sheet>
              
    <div className=" hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2">

              <SheetTrigger>Produtos</SheetTrigger>
    </div>
              
              <SheetContent side="right" size="extraLarge">
                <SheetHeader>
                
                  <SheetTitle>Produtos</SheetTitle>
                  
                  <SheetDescription>Descrição do produto</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      placeholder="Buscar por ID"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-primaryLight"
                    />
                    <button
                      onClick={fetchProductById}
                      className="px-4 py-2 bg-primary text-white rounded"
                    >
                      Buscar
                    </button>
                  </div>
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      placeholder="Buscar por Nome"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-primaryLight"
                    />
                    <button
                      onClick={fetchProductByName}
                      className="px-4 py-2 bg-primary text-white rounded"
                    >
                      Buscar
                    </button>
                  </div>
                  <button
                    onClick={fetchAllProducts}
                    className="px-4 py-2 bg-secondary text-white rounded mb-4"
                  >
                    Buscar Todos os Produtos
                  </button>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ERP ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{product.erpId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingProductId === product.id ? (
                              <button
                                onClick={() => handleSaveProductClick(product.id)}
                                className="px-4 py-2 bg-secondary text-white rounded"
                              >
                                Salvar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditProductClick(product)}
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
                  {editingProductId && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-primaryDark dark:text-primaryLight">Editar Produto</h3>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                          <input
                            type="text"
                            name="name"
                            value={editProductData.name}
                            onChange={handleProductInputChange}
                            className="text-primaryLight px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                          <input
                            type="text"
                            name="description"
                            value={editProductData.description}
                            onChange={handleProductInputChange}
                            className="text-primaryLight px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preço</label>
                          <input
                            type="number"
                            name="price"
                            value={editProductData.price}
                            onChange={handleProductInputChange}
                            className="text-primaryLight px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estoque</label>
                          <input
                            type="number"
                            name="stock"
                            value={editProductData.stock}
                            onChange={handleProductInputChange}
                            className="text-primaryLight px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                          <input
                            type="text"
                            name="category"
                            value={editProductData.category}
                            onChange={handleProductInputChange}
                            className="px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                          <input
                            type="text"
                            name="brand"
                            value={editProductData.brand}
                            onChange={handleProductInputChange}
                            className="text-primaryLight px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagem URL</label>
                          <input
                            type="text"
                            name="imageUrl"
                            value={editProductData.imageUrl}
                            onChange={handleProductInputChange}
                            className="px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ERP ID</label>
                          <input
                            type="text"
                            name="erpId"
                            value={editProductData.erpId}
                            onChange={handleProductInputChange}
                            className="text-primaryLight px-2 py-1 border border-gray-300 rounded w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
            <Sheet>
            <div className=" hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2">

              <SheetTrigger>Categorias</SheetTrigger>
              </div>
              <SheetContent side="right" size="extraLarge">
                <SheetHeader>
                  <SheetTitle>Categorias</SheetTitle>
                  <SheetDescription>Categoria Descrição</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">imagem</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ERP ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                      {categories.map((category) => (
                        <tr key={category._id.value}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{category._id.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingCategoryId === category._id.value ? (
                              <input
                                type="text"
                                name="name"
                                value={editCategoryData.name}
                                onChange={handleCategoryInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              category.props.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingCategoryId === category._id.value ? (
                              <input
                                type="text"
                                name="description"
                                value={editCategoryData.imageUrl}
                                onChange={handleCategoryInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              category.props.imageUrl
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{category.props.erpId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingCategoryId === category._id.value ? (
                              <button
                                onClick={() => handleSaveCategoryClick(category._id.value)}
                                className="px-4 py-2 bg-secondary text-white rounded"
                              >
                                Salvar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditCategoryClick(category)}
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
            </Sheet>
          </div>
          


   <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded">
            <Sheet>
            <div className=" hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2">

              <SheetTrigger>Cores</SheetTrigger>
              </div>
              <SheetContent side="right" size="extraLarge">
                <SheetHeader>
                  <SheetTitle>Cores</SheetTitle>
                  <SheetDescription>Cores Descrição</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Hex</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ERP ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                      {colors.map((color) => (
                        <tr key={color._id.value}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{color._id.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingColorId === color._id.value ? (
                              <input
                                type="text"
                                name="name"
                                value={editColorData.name}
                                onChange={handleInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              color.props.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingColorId === color._id.value ? (
                              <input
                                type="text"
                                name="hex"
                                value={editColorData.hex}
                                onChange={handleInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              color.props.hex
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{color.props.erpId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingColorId === color._id.value ? (
                              <button
                                onClick={() => handleSaveClick(color._id.value)}
                                className="px-4 py-2 bg-secondary dark:bg-primarytext-white rounded"
                              >
                                Salvar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditClick(color)}
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
            </Sheet>
          </div>

          <div className="bg-primaryLight dark:bg-primaryDark  p-2 rounded">
            <Sheet>
            <div className=" hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2">

              <SheetTrigger>Tamanhos</SheetTrigger>
              </div>

              <SheetContent side="right" size="extraLarge">
                <SheetHeader>
                  <SheetTitle>Tamanhos</SheetTitle>
                  
                </SheetHeader>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider"></th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ERP ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Ações</th>
                      </tr>

                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                      {sizes.map((size) => (
                        <tr key={size._id.value}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{size._id.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingSizeId === size._id.value ? (
                              <input
                                type="text"
                                name="name"
                                value={editSizeData.name}
                                onChange={handleSizeInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              size.props.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">

                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{size.props.erpId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingSizeId === size._id.value ? (
                              <button
                                onClick={() => handleSaveSizeClick(size._id.value)}
                                className="px-4 py-2 bg-primary text-white rounded"
                              >
                                Salvar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditSizeClick(size)}
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
            </Sheet>
          </div>


          <div className="bg-primaryLight dark:bg-primaryDark p-2 rounded">
            <Sheet>
            <div className=" hover:bg-primary hover:scale-110 hover:text-primaryDark transition duration-300 ease-in-out rounded p-2">

              <SheetTrigger>Fabricantes</SheetTrigger>
              </div>
              <SheetContent side="right" size="extraLarge">
                <SheetHeader>
                  <SheetTitle>Fabricantes</SheetTitle>
                  <SheetDescription>Fabricante Descrição</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-primaryLight dark:bg-primaryDark rounded">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Imagem</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">ERP ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primaryDark dark:text-primaryLight uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-primaryLight dark:bg-primaryDark divide-y divide-gray-200 dark:divide-gray-700">
                      {brands.map((brand) => (
                        <tr key={brand._id.value}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{brand._id.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingBrandId === brand._id.value ? (
                              <input
                                type="text"
                                name="name"
                                value={editBrandData.name}
                                onChange={handleBrandInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              brand.props.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingBrandId === brand._id.value ? (
                              <input
                                type="text"
                                name="imageUrl"
                                value={editBrandData.imageUrl}
                                onChange={handleBrandInputChange}
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              brand.props.imageUrl
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{brand.props.erpId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            {editingBrandId === brand._id.value ? (
                              <button
                                onClick={() => handleSaveBrandClick(brand._id.value)}
                                className="px-4 py-2 bg-primary text-white rounded"
                              >
                                Salvar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditBrandClick(brand)}
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
            </Sheet>
          </div>


        </nav>
      </div>

      <main className="flex-1 p-8 bg-primaryLight dark:bg-primaryDark z-20  ">
        <h1 className="text-2xl text-primaryDark dark:text-primaryLight font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-primaryDark dark:text-primaryLight">
          Bem vindo a area de Adm do Site Stylos
        </p>
      </main>
    </div>
  );
};

export default AdminPage;
