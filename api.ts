const apiUrl = window.location.hostname.includes("devtunnels.ms")
  ? "https://0a96-2804-14d-3287-5bd5-bcef-3f6c-ce8f-c84d.ngrok-free.app"
  : "http://localhost:3333/";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function fetchFromApi(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const response = await fetch(`${apiUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
