import request from "supertest";
import app from "../../app";

/**
 * TDD Tests for Menu Display Feature
 *
 * Requirements:
 * - A list of food items (e.g., pizza, burgers, etc.) displayed on the UI
 * - Each item has a name, description, price, and image
 */

describe("Menu Display API", () => {
  describe("GET /api/menu", () => {
    it("should return a list of all available menu items", async () => {
      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should return menu items with required fields: name, description, price, image", async () => {
      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);

      const item = response.body.data[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("imageUrl");
    });

    it("should only return available menu items (isAvailable: true)", async () => {
      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);

      // All returned items should be available
      response.body.data.forEach((item: any) => {
        expect(item.isAvailable).toBe(true);
      });

      // Should not include the unavailable pizza
      const unavailableItem = response.body.data.find(
        (item: any) => item.name === "Unavailable Pizza",
      );
      expect(unavailableItem).toBeUndefined();
    });

    it("should include category information for each menu item", async () => {
      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);

      const item = response.body.data[0];
      expect(item).toHaveProperty("category");
      expect(item.category).toHaveProperty("id");
      expect(item.category).toHaveProperty("name");
    });
  });

  describe("GET /api/menu/:id", () => {
    it("should return a single menu item by ID", async () => {
      // First get the list to find a valid ID
      const listResponse = await request(app).get("/api/menu");
      const firstItem = listResponse.body.data[0];

      const response = await request(app).get(`/api/menu/${firstItem.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(firstItem.id);
      expect(response.body.data.name).toBe(firstItem.name);
    });

    it("should return 404 for non-existent menu item", async () => {
      const response = await request(app).get("/api/menu/99999");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/categories", () => {
    it("should return a list of all active categories", async () => {
      const response = await request(app).get("/api/categories");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should include menu items count for each category", async () => {
      const response = await request(app).get("/api/categories");

      expect(response.status).toBe(200);

      const category = response.body.data[0];
      expect(category).toHaveProperty("_count");
      expect(category._count).toHaveProperty("menuItems");
    });
  });

  describe("GET /api/menu with pagination", () => {
    it("should support pagination with page and limit parameters", async () => {
      const response = await request(app).get("/api/menu?page=1&limit=1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it("should return pagination metadata", async () => {
      const response = await request(app).get("/api/menu?page=1&limit=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("meta");
      expect(response.body.meta).toHaveProperty("page");
      expect(response.body.meta).toHaveProperty("limit");
      expect(response.body.meta).toHaveProperty("total");
      expect(response.body.meta).toHaveProperty("totalPages");
      expect(response.body.meta).toHaveProperty("hasNextPage");
      expect(response.body.meta).toHaveProperty("hasPreviousPage");
    });

    it("should return correct pagination values", async () => {
      const response = await request(app).get("/api/menu?page=1&limit=1");

      expect(response.status).toBe(200);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(1);
      expect(response.body.meta.total).toBeGreaterThan(0);
      expect(response.body.meta.hasPreviousPage).toBe(false);
    });

    it("should use default pagination when no parameters provided", async () => {
      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("meta");
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(10);
    });
  });
});
