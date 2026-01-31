import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OrderDetailPage } from "../OrderDetail";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { OrderStatus } from "@/types/api";

// Mock hook
const mockUseOrder = vi.fn();

vi.mock("@/hooks/use-orders", () => ({
    useOrder: (id: string) => mockUseOrder(id),
}));

const renderWithRouter = (
    ui: React.ReactElement,
    { route = "/orders/test-uuid" } = {},
) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/orders/:id" element={ui} />
            </Routes>
        </MemoryRouter>,
    );
};

describe("OrderDetailPage", () => {
    it("renders loading state", () => {
        mockUseOrder.mockReturnValue({
            isLoading: true,
            data: null,
        });

        renderWithRouter(<OrderDetailPage />);
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("renders error state when order not found", () => {
        mockUseOrder.mockReturnValue({
            isLoading: false,
            isError: true,
            data: null,
        });

        renderWithRouter(<OrderDetailPage />);
        expect(screen.getByText("Order not found")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /back to orders/i }),
        ).toBeInTheDocument();
    });

    it("renders order details correctly", () => {
        const mockOrder = {
            uuid: "order-123-uuid",
            createdAt: new Date().toISOString(),
            status: OrderStatus.PREPARING,
            subtotal: "20.00",
            deliveryFee: "5.00",
            totalAmount: "25.00",
            customerName: "John Doe",
            customerPhone: "1234567890",
            deliveryAddress: "123 Main St",
            notes: "Test note",
            orderItems: [
                {
                    id: 1,
                    itemName: "Burger",
                    quantity: 2,
                    subtotal: "20.00",
                },
            ],
            statusHistory: [
                {
                    id: 1,
                    status: OrderStatus.PENDING,
                    createdAt: new Date(Date.now() - 10000).toISOString(),
                    notes: "Order placed",
                },
                {
                    id: 2,
                    status: OrderStatus.PREPARING,
                    createdAt: new Date().toISOString(),
                    notes: "Kitchen started",
                },
            ],
        };

        mockUseOrder.mockReturnValue({
            isLoading: false,
            data: { data: mockOrder },
        });

        renderWithRouter(<OrderDetailPage />);

        expect(screen.getByText(/Order #\s*order-12/i)).toBeInTheDocument();
        expect(screen.getByText("Preparing")).toBeInTheDocument(); // Status badge
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("1234567890")).toBeInTheDocument();
        expect(screen.getByText("123 Main St")).toBeInTheDocument();
        expect(screen.getByText('"Test note"')).toBeInTheDocument();

        // Items
        expect(screen.getByText("Burger")).toBeInTheDocument();
        expect(screen.getByText("2x")).toBeInTheDocument();
        expect(screen.getByText("$25.00")).toBeInTheDocument(); // Total

        // Status history
        // Use getAllByText for 'Preparing' since it appears in badge and history
        expect(screen.getAllByText(/Preparing/i)).toHaveLength(2);
        expect(screen.getByText("Kitchen started")).toBeInTheDocument();
        expect(screen.getByText("Order placed")).toBeInTheDocument();
    });
});
