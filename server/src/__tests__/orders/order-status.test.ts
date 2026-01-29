import request from "supertest";
import app from "../../app";
import { prismaTest } from "../setup";

/**
 * TDD Tests for Order Status Feature
 *
 * Requirements:
 * - Once the order is placed, show the status (e.g., "Order Received", "Preparing", "Out for Delivery")
 * - Real-time updates of the status (simulated in back-end)
 */

describe("Order Status API", () => {
    const testSessionId = "test-status-session-456";
    let testOrderUuid: string;

    // Setup: Create an order before status tests
    beforeAll(async () => {
        // Clear and seed data
        await prismaTest.orderStatusHistory.deleteMany();
        await prismaTest.orderItem.deleteMany();
        await prismaTest.order.deleteMany();
        await prismaTest.cartItem.deleteMany({
            where: { sessionId: testSessionId },
        });

        // Add items to cart
        const menuItem = await prismaTest.menuItem.findFirst({
            where: { isAvailable: true },
        });

        if (menuItem) {
            await prismaTest.cartItem.create({
                data: {
                    sessionId: testSessionId,
                    menuItemId: menuItem.id,
                    quantity: 1,
                },
            });
        }

        // Create test order
        const response = await request(app).post("/api/orders").send({
            sessionId: testSessionId,
            customerName: "Status Test User",
            customerPhone: "555-STATUS",
            deliveryAddress: "123 Status Street",
        });

        testOrderUuid = response.body.data.uuid;
    });

    describe("GET /api/orders/:uuid/status", () => {
        it("should return current order status", async () => {
            const response = await request(app).get(
                `/api/orders/${testOrderUuid}/status`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("status");
            expect(response.body.data.status).toBe("PENDING");
        });

        it("should include status display text", async () => {
            const response = await request(app).get(
                `/api/orders/${testOrderUuid}/status`,
            );

            expect(response.body.data).toHaveProperty("statusText");
            // PENDING should display as "Order Received"
            expect(response.body.data.statusText).toBe("Order Received");
        });

        it("should include status history", async () => {
            const response = await request(app).get(
                `/api/orders/${testOrderUuid}/status`,
            );

            expect(response.body.data).toHaveProperty("history");
            expect(Array.isArray(response.body.data.history)).toBe(true);
            expect(response.body.data.history.length).toBeGreaterThan(0);
        });

        it("should include estimated time if available", async () => {
            const response = await request(app).get(
                `/api/orders/${testOrderUuid}/status`,
            );

            // For orders in progress, should have estimated time
            if (
                response.body.data.status !== "DELIVERED" &&
                response.body.data.status !== "CANCELLED"
            ) {
                expect(response.body.data).toHaveProperty("estimatedMinutes");
            }
        });
    });

    describe("PUT /api/orders/:uuid/status (Admin)", () => {
        it("should update order status to CONFIRMED", async () => {
            const response = await request(app)
                .put(`/api/orders/${testOrderUuid}/status`)
                .send({ status: "CONFIRMED" });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("CONFIRMED");
        });

        it("should add entry to status history on update", async () => {
            // Update to PREPARING
            await request(app)
                .put(`/api/orders/${testOrderUuid}/status`)
                .send({ status: "PREPARING" });

            // Get status to check history
            const response = await request(app).get(
                `/api/orders/${testOrderUuid}/status`,
            );

            expect(response.body.data.history.length).toBeGreaterThanOrEqual(2);
            const latestHistory = response.body.data.history[0];
            expect(latestHistory.status).toBe("PREPARING");
        });

        it("should include notes in status history", async () => {
            await request(app).put(`/api/orders/${testOrderUuid}/status`).send({
                status: "OUT_FOR_DELIVERY",
                notes: "Driver: John, ETA: 15 mins",
            });

            const response = await request(app).get(
                `/api/orders/${testOrderUuid}/status`,
            );

            const latestHistory = response.body.data.history[0];
            expect(latestHistory.notes).toBe("Driver: John, ETA: 15 mins");
        });

        it("should update to DELIVERED status", async () => {
            const response = await request(app)
                .put(`/api/orders/${testOrderUuid}/status`)
                .send({ status: "DELIVERED" });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("DELIVERED");
        });

        it("should reject invalid status", async () => {
            const response = await request(app)
                .put(`/api/orders/${testOrderUuid}/status`)
                .send({ status: "INVALID_STATUS" });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should return 404 for non-existent order", async () => {
            const response = await request(app)
                .put("/api/orders/00000000-0000-0000-0000-000000000000/status")
                .send({ status: "CONFIRMED" });

            expect(response.status).toBe(404);
        });
    });

    describe("Order Status Flow", () => {
        let flowOrderUuid: string;
        const flowSessionId = "test-flow-session";

        beforeAll(async () => {
            // Create new order for flow test
            await prismaTest.cartItem.deleteMany({
                where: { sessionId: flowSessionId },
            });

            const menuItem = await prismaTest.menuItem.findFirst({
                where: { isAvailable: true },
            });

            if (menuItem) {
                await prismaTest.cartItem.create({
                    data: {
                        sessionId: flowSessionId,
                        menuItemId: menuItem.id,
                        quantity: 1,
                    },
                });
            }

            const response = await request(app).post("/api/orders").send({
                sessionId: flowSessionId,
                customerName: "Flow Test",
                customerPhone: "555-FLOW",
                deliveryAddress: "Flow Street",
            });

            flowOrderUuid = response.body.data.uuid;
        });

        it("should follow correct status flow: PENDING -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED", async () => {
            const statuses = [
                "CONFIRMED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
            ];
            const statusTexts = [
                "Order Confirmed",
                "Preparing",
                "Out for Delivery",
                "Delivered",
            ];

            for (let i = 0; i < statuses.length; i++) {
                const updateResponse = await request(app)
                    .put(`/api/orders/${flowOrderUuid}/status`)
                    .send({ status: statuses[i] });

                expect(updateResponse.status).toBe(200);
                expect(updateResponse.body.data.status).toBe(statuses[i]);

                // Check status text
                const statusResponse = await request(app).get(
                    `/api/orders/${flowOrderUuid}/status`,
                );
                expect(statusResponse.body.data.statusText).toBe(
                    statusTexts[i],
                );
            }

            // Verify full history
            const finalResponse = await request(app).get(
                `/api/orders/${flowOrderUuid}/status`,
            );
            expect(finalResponse.body.data.history.length).toBe(5); // PENDING + 4 updates
        });
    });

    describe("Cancel Order", () => {
        it("should allow cancelling an order", async () => {
            // Create new order for cancel test
            const cancelSessionId = "test-cancel-session";
            await prismaTest.cartItem.deleteMany({
                where: { sessionId: cancelSessionId },
            });

            const menuItem = await prismaTest.menuItem.findFirst({
                where: { isAvailable: true },
            });

            if (menuItem) {
                await prismaTest.cartItem.create({
                    data: {
                        sessionId: cancelSessionId,
                        menuItemId: menuItem.id,
                        quantity: 1,
                    },
                });
            }

            const createResponse = await request(app).post("/api/orders").send({
                sessionId: cancelSessionId,
                customerName: "Cancel Test",
                customerPhone: "555-CANCEL",
                deliveryAddress: "Cancel Street",
            });

            const cancelOrderUuid = createResponse.body.data.uuid;

            const response = await request(app)
                .put(`/api/orders/${cancelOrderUuid}/status`)
                .send({
                    status: "CANCELLED",
                    notes: "Customer requested cancellation",
                });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("CANCELLED");

            // Check status text
            const statusResponse = await request(app).get(
                `/api/orders/${cancelOrderUuid}/status`,
            );
            expect(statusResponse.body.data.statusText).toBe("Cancelled");
        });
    });
});
