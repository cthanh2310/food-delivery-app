import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OrdersPage } from "../Orders";
import { MemoryRouter } from "react-router-dom";
import { OrderStatus } from "@/types/api";

// Mock hook
const mockUseSessionOrders = vi.fn();

vi.mock("@/hooks/use-orders", () => ({
    useSessionOrders: (params: any) => mockUseSessionOrders(params),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
);

describe("OrdersPage", () => {
    it("renders loading state", () => {
        mockUseSessionOrders.mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<OrdersPage />, { wrapper });
        // Loader2 usually checks for class
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
        // Since Loader2 is likely an SVG, verify by checking for specific class if role not present, or just wait for spinner text if any.
        // Actually, Loader2 is from lucide-react, rendered as SVG.
        // Let's check for "animate-spin" class instead or just rely on getByTestId if added.
        // Or simpler, check if "Your Orders" is NOT present because loading returns early?
        // Ah, looking at Orders.tsx, it returns early on isLoading:
        /*
        if (isLoading) {
            return (
                <div className="flex h-[50vh] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }
        */
        // So "Your Orders" text won't be there.
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("renders empty state when no orders", () => {
        mockUseSessionOrders.mockReturnValue({
            isLoading: false,
            data: { data: [], meta: { page: 1, totalPages: 1 } },
        });

        render(<OrdersPage />, { wrapper });
        expect(screen.getByText("No orders yet")).toBeInTheDocument();
        expect(
            screen.getByText("When you place an order, it will appear here."),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /browse menu/i }),
        ).toBeInTheDocument();
    });

    it("renders list of orders", () => {
        const mockOrders = [
            {
                uuid: "order-123-uuid",
                createdAt: new Date().toISOString(),
                status: OrderStatus.PENDING,
                totalAmount: "25.50",
                orderItems: [{ id: 1 }, { id: 2 }],
            },
            {
                uuid: "order-456-uuid",
                createdAt: new Date().toISOString(),
                status: OrderStatus.CONFIRMED,
                totalAmount: "42.00",
                orderItems: [{ id: 3 }],
            },
        ];

        mockUseSessionOrders.mockReturnValue({
            isLoading: false,
            data: { data: mockOrders, meta: { page: 1, totalPages: 1 } },
        });

        render(<OrdersPage />, { wrapper });

        expect(screen.getByText(/Order #\s*order-12/i)).toBeInTheDocument();
        expect(screen.getByText(/Order #\s*order-45/i)).toBeInTheDocument();
        expect(screen.getByText("$25.50")).toBeInTheDocument();
        expect(screen.getByText("$42.00")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
        expect(screen.getByText("Confirmed")).toBeInTheDocument();
    });
});
