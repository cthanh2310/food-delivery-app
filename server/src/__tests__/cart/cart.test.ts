import request from "supertest";
import app from "../../app";
import { prismaTest } from "../setup";

/**
 * TDD Tests for Cart Feature
 *
 * Requirements:
 * - Users can add items to their cart
 * - Users can specify the quantity of each item in the cart
 */

describe("Cart API", () => {
    const testSessionId = "test-session-12345";

    // Clean up cart before each test
    beforeEach(async () => {
        await prismaTest.cartItem.deleteMany({
            where: { sessionId: testSessionId },
        });
    });

    describe("POST /api/cart", () => {
        it("should add an item to the cart", async () => {
            // Get a valid menu item
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            const response = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 1,
            });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data.menuItemId).toBe(menuItem.id);
            expect(response.body.data.quantity).toBe(1);
        });

        it("should add item with specified quantity", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            const response = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 3,
            });

            expect(response.status).toBe(201);
            expect(response.body.data.quantity).toBe(3);
        });

        it("should update quantity if item already exists in cart", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            // Add item first time
            await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 2,
            });

            // Add same item again
            const response = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 3,
            });

            expect(response.status).toBe(200);
            expect(response.body.data.quantity).toBe(5); // 2 + 3
        });

        it("should reject invalid menu item ID", async () => {
            const response = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: 99999,
                quantity: 1,
            });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should reject quantity less than 1", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            const response = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 0,
            });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/cart/:sessionId", () => {
        it("should return cart items for a session", async () => {
            // Add item to cart first
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 2,
            });

            const response = await request(app).get(
                `/api/cart/${testSessionId}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.items)).toBe(true);
            expect(response.body.data.items.length).toBe(1);
        });

        it("should include menu item details in cart items", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 1,
            });

            const response = await request(app).get(
                `/api/cart/${testSessionId}`,
            );

            const cartItem = response.body.data.items[0];
            expect(cartItem).toHaveProperty("menuItem");
            expect(cartItem.menuItem).toHaveProperty("name");
            expect(cartItem.menuItem).toHaveProperty("price");
            expect(cartItem.menuItem).toHaveProperty("imageUrl");
        });

        it("should calculate cart total", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 2,
            });

            const response = await request(app).get(
                `/api/cart/${testSessionId}`,
            );

            expect(response.body.data).toHaveProperty("subtotal");
            expect(response.body.data.subtotal).toBe(
                Number(menuItem.price) * 2,
            );
        });

        it("should return empty cart for new session", async () => {
            const response = await request(app).get(
                "/api/cart/new-session-xyz",
            );

            expect(response.status).toBe(200);
            expect(response.body.data.items).toEqual([]);
            expect(response.body.data.subtotal).toBe(0);
        });
    });

    describe("PUT /api/cart/:sessionId/:itemId", () => {
        it("should update quantity of cart item", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            // Add item
            const addResponse = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 1,
            });

            const cartItemId = addResponse.body.data.id;

            // Update quantity
            const response = await request(app)
                .put(`/api/cart/${testSessionId}/${cartItemId}`)
                .send({ quantity: 5 });

            expect(response.status).toBe(200);
            expect(response.body.data.quantity).toBe(5);
        });

        it("should reject quantity less than 1", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            const addResponse = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 1,
            });

            const cartItemId = addResponse.body.data.id;

            const response = await request(app)
                .put(`/api/cart/${testSessionId}/${cartItemId}`)
                .send({ quantity: 0 });

            expect(response.status).toBe(400);
        });
    });

    describe("DELETE /api/cart/:sessionId/:itemId", () => {
        it("should remove item from cart", async () => {
            const menuResponse = await request(app).get("/api/menu");
            const menuItem = menuResponse.body.data[0];

            const addResponse = await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuItem.id,
                quantity: 1,
            });

            const cartItemId = addResponse.body.data.id;

            const response = await request(app).delete(
                `/api/cart/${testSessionId}/${cartItemId}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify item is removed
            const cartResponse = await request(app).get(
                `/api/cart/${testSessionId}`,
            );
            expect(cartResponse.body.data.items.length).toBe(0);
        });
    });

    describe("DELETE /api/cart/:sessionId", () => {
        it("should clear all items from cart", async () => {
            const menuResponse = await request(app).get("/api/menu");

            // Add multiple items
            await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuResponse.body.data[0].id,
                quantity: 1,
            });

            await request(app).post("/api/cart").send({
                sessionId: testSessionId,
                menuItemId: menuResponse.body.data[1].id,
                quantity: 2,
            });

            const response = await request(app).delete(
                `/api/cart/${testSessionId}`,
            );

            expect(response.status).toBe(200);

            // Verify cart is empty
            const cartResponse = await request(app).get(
                `/api/cart/${testSessionId}`,
            );
            expect(cartResponse.body.data.items.length).toBe(0);
        });
    });
});
