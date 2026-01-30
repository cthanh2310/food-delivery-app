import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CheckoutDialog } from "./CheckoutDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
const mockMutate = vi.fn();
vi.mock("@/hooks/use-orders", () => ({
    useCreateOrder: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
);

describe("CheckoutDialog", () => {
    it("renders the checkout button", () => {
        render(<CheckoutDialog sessionId="test-session" />, { wrapper });
        expect(
            screen.getByRole("button", { name: /checkout/i }),
        ).toBeInTheDocument();
    });

    it("opens the dialog when checkout button is clicked", async () => {
        render(<CheckoutDialog sessionId="test-session" />, { wrapper });

        fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        expect(
            screen.getByText("Enter your details to place the order."),
        ).toBeInTheDocument();
    });

    it("validates required fields", async () => {
        render(<CheckoutDialog sessionId="test-session" />, { wrapper });

        // Open dialog
        fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

        // Click submit without filling details
        fireEvent.click(screen.getByRole("button", { name: /place order/i }));

        expect(await screen.findByText("Name is required")).toBeInTheDocument();
        expect(screen.getByText("Phone is required")).toBeInTheDocument();
        expect(screen.getByText("Address is required")).toBeInTheDocument();
    });

    it("submits the form with valid data", async () => {
        render(<CheckoutDialog sessionId="test-session" />, { wrapper });

        // Open dialog
        fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

        // Fill form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: "John Doe" },
        });
        fireEvent.change(screen.getByLabelText(/phone/i), {
            target: { value: "1234567890" },
        });
        fireEvent.change(screen.getByLabelText(/address/i), {
            target: { value: "123 Main St" },
        });
        fireEvent.change(screen.getByLabelText(/notes/i), {
            target: { value: "Please ring the bell" },
        });

        // Submit
        fireEvent.click(screen.getByRole("button", { name: /place order/i }));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                {
                    customerName: "John Doe",
                    customerPhone: "1234567890",
                    deliveryAddress: "123 Main St",
                    notes: "Please ring the bell",
                },
                expect.any(Object),
            );
        });
    });
});
