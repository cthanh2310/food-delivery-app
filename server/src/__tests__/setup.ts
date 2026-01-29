import { PrismaClient } from "@prisma/client";

// Create a test instance of Prisma
export const prismaTest = new PrismaClient();

// Seed test data before all tests
beforeAll(async () => {
    // Clear all test data first (in correct order due to foreign keys)
    await prismaTest.orderStatusHistory.deleteMany();
    await prismaTest.orderItem.deleteMany();
    await prismaTest.order.deleteMany();
    await prismaTest.cartItem.deleteMany();
    await prismaTest.menuItem.deleteMany();
    await prismaTest.category.deleteMany();

    // Seed test data
    const category = await prismaTest.category.create({
        data: {
            name: "Test Pizza",
            description: "Test category",
            isActive: true,
        },
    });

    await prismaTest.menuItem.createMany({
        data: [
            {
                categoryId: category.id,
                name: "Margherita Pizza",
                description: "Classic pizza with tomatoes and mozzarella",
                price: 12.99,
                imageUrl: "https://example.com/margherita.jpg",
                isAvailable: true,
            },
            {
                categoryId: category.id,
                name: "Pepperoni Pizza",
                description: "Pizza with spicy pepperoni",
                price: 14.99,
                imageUrl: "https://example.com/pepperoni.jpg",
                isAvailable: true,
            },
            {
                categoryId: category.id,
                name: "Unavailable Pizza",
                description: "This pizza is not available",
                price: 19.99,
                imageUrl: "https://example.com/unavailable.jpg",
                isAvailable: false,
            },
        ],
    });
});

// Clean up after each test file
afterAll(async () => {
    await prismaTest.$disconnect();
});
