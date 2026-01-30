import {
    ApiResponse,
    Cart,
    CartItem,
    MenuItem,
    Order,
    PaginatedResponse,
} from "@/types/api";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message?: string,
    ) {
        super(message || `API Error: ${status} ${statusText}`);
        this.name = "ApiError";
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, string | number | undefined>;
};

async function request<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = "GET", body, headers = {}, params } = options;

    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        url += `?${searchParams.toString()}`;
    }

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
            response.status,
            response.statusText,
            errorData?.message || errorData?.error,
        );
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// Base API Client
export const apiClient = {
    get: <T>(
        endpoint: string,
        options?: {
            headers?: Record<string, string>;
            params?: Record<string, string | number | undefined>;
        },
    ) => request<T>(endpoint, { method: "GET", ...options }),

    post: <T>(
        endpoint: string,
        body?: unknown,
        options?: { headers?: Record<string, string> },
    ) => request<T>(endpoint, { method: "POST", body, ...options }),

    put: <T>(
        endpoint: string,
        body?: unknown,
        options?: { headers?: Record<string, string> },
    ) => request<T>(endpoint, { method: "PUT", body, ...options }),

    patch: <T>(
        endpoint: string,
        body?: unknown,
        options?: { headers?: Record<string, string> },
    ) => request<T>(endpoint, { method: "PATCH", body, ...options }),

    delete: <T>(
        endpoint: string,
        options?: { headers?: Record<string, string> },
    ) => request<T>(endpoint, { method: "DELETE", ...options }),
};

// Domain APIs
export const menuApi = {
    getAll: (params?: { page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<MenuItem>>("/menu", { params }),

    getOne: (id: number) => apiClient.get<ApiResponse<MenuItem>>(`/menu/${id}`),
};

export const cartApi = {
    get: (sessionId: string) =>
        apiClient.get<ApiResponse<Cart>>(`/cart/${sessionId}`),

    add: (sessionId: string, menuItemId: number, quantity: number) =>
        apiClient.post<ApiResponse<CartItem>>("/cart", {
            sessionId,
            menuItemId,
            quantity,
        }),

    update: (sessionId: string, itemId: number, quantity: number) =>
        apiClient.put<ApiResponse<CartItem>>(`/cart/${sessionId}/${itemId}`, {
            quantity,
        }),

    remove: (sessionId: string, itemId: number) =>
        apiClient.delete<ApiResponse<{ message: string }>>(
            `/cart/${sessionId}/${itemId}`,
        ),

    clear: (sessionId: string) =>
        apiClient.delete<ApiResponse<{ message: string }>>(
            `/cart/${sessionId}`,
        ),
};

export const orderApi = {
    create: (data: {
        sessionId: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        notes?: string;
    }) => apiClient.post<ApiResponse<Order>>("/orders", data),

    getOne: (uuid: string) =>
        apiClient.get<ApiResponse<Order>>(`/orders/${uuid}`),

    getSessionOrders: (
        sessionId: string,
        params?: { page?: number; limit?: number },
    ) =>
        apiClient.get<PaginatedResponse<Order>>(
            `/orders/session/${sessionId}`,
            { params },
        ),

    getStatus: (uuid: string) =>
        apiClient.get<
            ApiResponse<{
                status: string;
                statusText: string;
                estimatedMinutes: number | null;
                history: any[];
            }>
        >(`/orders/${uuid}/status`),
};
