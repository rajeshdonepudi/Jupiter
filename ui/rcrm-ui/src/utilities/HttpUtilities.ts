type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
};

export default async function fetchWrapper<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const { method = "GET", headers = {}, body } = options;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    throw error;
  }
}
