import request from "supertest";
import app from "../../app";
import { prismaTest } from "../setup";

/**
 * TDD Tests for Order Placement Feature
 *
 * Requirements:
 * - Users can proceed to checkout
 * - Users enter their delivery details (name, address, phone number)
 */

describe("Order Placement API", () => {
    const testSessionId = "test-order-session-123";

    // Setup: Add items to cart before order tests
    beforeEach(async () => {
        // Clear previous orders and cart
        await prismaTest.orderStatusHistory.deleteMany();
        await prismaTest.orderItem.deleteMany();
        await prismaTest.order.deleteMany();
        await prismaTest.cartItem.deleteMany({
            where: { sessionId: testSessionId },
        });

        // Add items to cart
        const menuItems = await prismaTest.menuItem.findMany({
            where: { isAvailable: true },
            take: 2,
        });

        for (const item of menuItems) {
            await prismaTest.cartItem.create({
                data: {
                    sessionId: testSessionId,
                    menuItemId: item.id,
                    quantity: 2,
                },
            });
        }
    });

    describe("POST /api/orders", () => {
        const validOrderData = {
            sessionId: testSessionId,
            customerName: "John Doe",
            customerPhone: "555-1234",
            deliveryAddress: "123 Main Street, City, 12345",
            notes: "Please ring the doorbell",
        };

        it("should create an order with delivery details", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send(validOrderData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data).toHaveProperty("uuid");
            expect(response.body.data.customerName).toBe(
                validOrderData.customerName,
            );
            expect(response.body.data.customerPhone).toBe(
                validOrderData.customerPhone,
            );
            expect(response.body.data.deliveryAddress).toBe(
                validOrderData.deliveryAddress,
            );
        });

        it("should set initial order status to PENDING", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send(validOrderData);

            expect(response.status).toBe(201);
            expect(response.body.data.status).toBe("PENDING");
        });

        it("should calculate order totals correctly", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send(validOrderData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("subtotal");
            expect(response.body.data).toHaveProperty("deliveryFee");
            expect(response.body.data).toHaveProperty("totalAmount");
            expect(Number(response.body.data.totalAmount)).toBeGreaterThan(0);
        });

        it("should include order items snapshot", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send(validOrderData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("orderItems");
            expect(Array.isArray(response.body.data.orderItems)).toBe(true);
            expect(response.body.data.orderItems.length).toBeGreaterThan(0);

            // Each order item should have snapshot of name and price
            const orderItem = response.body.data.orderItems[0];
            expect(orderItem).toHaveProperty("itemName");
            expect(orderItem).toHaveProperty("unitPrice");
            expect(orderItem).toHaveProperty("quantity");
            expect(orderItem).toHaveProperty("subtotal");
        });

        it("should clear cart after successful order", async () => {
            await request(app).post("/api/orders").send(validOrderData);

            const cartResponse = await request(app).get(
                `/api/cart/${testSessionId}`,
            );
            expect(cartResponse.body.data.items.length).toBe(0);
        });

        it("should create initial status history entry", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send(validOrderData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("statusHistory");
            expect(response.body.data.statusHistory.length).toBe(1);
            expect(response.body.data.statusHistory[0].status).toBe("PENDING");
        });

        it("should reject order with empty cart", async () => {
            // Clear cart first
            await prismaTest.cartItem.deleteMany({
                where: { sessionId: testSessionId },
            });

            const response = await request(app)
                .post("/api/orders")
                .send(validOrderData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain("cart");
        });

        it("should reject order without customer name", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send({
                    ...validOrderData,
                    customerName: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should reject order without customer phone", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send({
                    ...validOrderData,
                    customerPhone: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should reject order without delivery address", async () => {
            const response = await request(app)
                .post("/api/orders")
                .send({
                    ...validOrderData,
                    deliveryAddress: "",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/orders/:uuid", () => {
        it("should retrieve order by UUID", async () => {
            // Create order first
            const createResponse = await request(app).post("/api/orders").send({
                sessionId: testSessionId,
                customerName: "Jane Doe",
                customerPhone: "555-5678",
                deliveryAddress: "456 Oak Avenue",
            });

            const orderUuid = createResponse.body.data.uuid;

            const response = await request(app).get(`/api/orders/${orderUuid}`);

            expect(response.status).toBe(200);
            expect(response.body.data.uuid).toBe(orderUuid);
        });

        it("should return 404 for non-existent order", async () => {
            const response = await request(app).get(
                "/api/orders/00000000-0000-0000-0000-000000000000",
            );

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/orders/session/:sessionId", () => {
        it("should retrieve all orders for a session", async () => {
            // Create order
            await request(app).post("/api/orders").send({
                sessionId: testSessionId,
                customerName: "Test User",
                customerPhone: "555-9999",
                deliveryAddress: "789 Pine Road",
            });

            const response = await request(app).get(
                `/api/orders/session/${testSessionId}`,
            );

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });
});
