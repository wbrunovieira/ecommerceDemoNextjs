import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export const fetchTopSellingByCategoryApi = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/orders/top-selling-categories-by-value`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar as cores: ', error);
        throw error;
    }
};
export const fetchTopSellingByProductApi = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/orders/top-selling-products-by-value`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar as cores: ', error);
        throw error;
    }
};

export const fetchTopSellingByBrandApi = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/orders/top-selling-brands-by-value`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar as cores: ', error);
        throw error;
    }
};

export const fetchColorsApi = async () => {
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
        return response.data.colors;
    } catch (error) {
        console.error('Erro ao buscar as cores: ', error);
        throw error;
    }
};

export const fetchSizesApi = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/size/all?page=1&pageSize=20`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.size;
    } catch (error) {
        console.error('Erro ao buscar os tamanhos: ', error);
        throw error;
    }
};

export const fetchCategoriesApi = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/category/all?page=1&pageSize=50`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.categories;
    } catch (error) {
        console.error('Erro ao buscar as categorias: ', error);
        throw error;
    }
};

export const fetchBrandsApi = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/brands/all?page=1&pageSize=10`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.brands;
    } catch (error) {
        console.error('Erro ao buscar os fabricantes: ', error);
        throw error;
    }
};

export const fetchCustomersApi = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/customers/all`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.customers;
    } catch (error) {
        console.error('Erro ao buscar os clientes: ', error);
        throw error;
    }
};
export const fetchOrdersApi = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os clientes: ', error);
        throw error;
    }
};

export const fetchOrdersIdApi = async (orderId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/order/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os clientes: ', error);
        throw error;
    }
};

export const fetchOrdersByProductApi = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/all`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os clientes: ', error);
        throw error;
    }
};
