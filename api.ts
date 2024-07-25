const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

export async function fetchFromApi(
    endpoint: string,
    options: FetchOptions = {}
): Promise<any> {
    const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
}
