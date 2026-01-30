// API types for the food delivery application

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: "customer" | "restaurant" | "driver" | "admin";
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

// Common types
export interface Category {
    id: number;
    name: string;
    description?: string;
}

// Menu item types
export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string; // Decimal from Prisma comes as string in JSON usually, or number if transformed
    imageUrl?: string;
    isAvailable: boolean;
    categoryId: number;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

// Cart types
export interface CartItem {
    id: number;
    sessionId: string;
    menuItemId: number;
    quantity: number;
    menuItem: MenuItem;
    createdAt: string;
    updatedAt: string;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
}

// Order types
export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PREPARING = "PREPARING",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export interface OrderItem {
    id: number;
    orderId: number;
    menuItemId: number;
    itemName: string;
    unitPrice: string;
    quantity: number;
    subtotal: string;
}

export interface OrderStatusHistory {
    id: number;
    orderId: number;
    status: OrderStatus;
    notes?: string;
    createdAt: string;
}

export interface Order {
    id: number;
    uuid: string;
    sessionId: string;
    status: OrderStatus;
    subtotal: string;
    deliveryFee: string;
    totalAmount: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
    statusHistory: OrderStatusHistory[];
}

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    message?: string;
    checkoutUrl?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
