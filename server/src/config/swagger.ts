import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Delivery API",
      version: "1.0.0",
      description:
        "A comprehensive REST API for a food delivery application with menu browsing, cart management, and order tracking features.",
      contact: {
        name: "API Support",
        email: "support@fooddelivery.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.fooddelivery.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Menu",
        description: "Menu items management",
      },
      {
        name: "Categories",
        description: "Food categories",
      },
      {
        name: "Cart",
        description: "Shopping cart operations",
      },
      {
        name: "Orders",
        description: "Order placement and management",
      },
      {
        name: "Order Status",
        description: "Order status tracking and updates",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Pizza",
            },
            description: {
              type: "string",
              example: "Delicious handcrafted pizzas",
            },
            imageUrl: {
              type: "string",
              example: "https://example.com/pizza.jpg",
            },
            sortOrder: {
              type: "integer",
              example: 1,
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            _count: {
              type: "object",
              properties: {
                menuItems: {
                  type: "integer",
                  example: 5,
                },
              },
            },
          },
        },
        MenuItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            uuid: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            categoryId: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Margherita Pizza",
            },
            description: {
              type: "string",
              example: "Classic pizza with fresh tomatoes and mozzarella",
            },
            price: {
              type: "number",
              format: "decimal",
              example: 12.99,
            },
            imageUrl: {
              type: "string",
              example: "https://example.com/margherita.jpg",
            },
            isAvailable: {
              type: "boolean",
              example: true,
            },
            category: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                },
                name: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
              },
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            sessionId: {
              type: "string",
              example: "session-123",
            },
            menuItemId: {
              type: "integer",
              example: 1,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            menuItem: {
              $ref: "#/components/schemas/MenuItem",
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CartItem",
              },
            },
            subtotal: {
              type: "number",
              example: 25.98,
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            orderId: {
              type: "integer",
              example: 1,
            },
            menuItemId: {
              type: "integer",
              example: 1,
            },
            itemName: {
              type: "string",
              example: "Margherita Pizza",
            },
            unitPrice: {
              type: "number",
              format: "decimal",
              example: 12.99,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            subtotal: {
              type: "number",
              format: "decimal",
              example: 25.98,
            },
          },
        },
        OrderStatusHistory: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            orderId: {
              type: "integer",
              example: 1,
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "CONFIRMED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
              ],
              example: "PENDING",
            },
            notes: {
              type: "string",
              example: "Order created",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            uuid: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            sessionId: {
              type: "string",
              example: "session-123",
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "CONFIRMED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
              ],
              example: "PENDING",
            },
            subtotal: {
              type: "number",
              format: "decimal",
              example: 25.98,
            },
            deliveryFee: {
              type: "number",
              format: "decimal",
              example: 5.0,
            },
            totalAmount: {
              type: "number",
              format: "decimal",
              example: 30.98,
            },
            customerName: {
              type: "string",
              example: "John Doe",
            },
            customerPhone: {
              type: "string",
              example: "555-1234",
            },
            deliveryAddress: {
              type: "string",
              example: "123 Main Street, City, 12345",
            },
            notes: {
              type: "string",
              example: "Please ring the doorbell",
            },
            orderItems: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            statusHistory: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderStatusHistory",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
