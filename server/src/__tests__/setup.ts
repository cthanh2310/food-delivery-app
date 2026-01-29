import { PrismaClient } from "@prisma/client";

// Create a test instance of Prisma
export const prismaTest = new PrismaClient();

let isSeeded = false;

// Seed test data before all tests (only once)
beforeAll(async () => {
  if (!isSeeded) {
    // Clear all test data first (in correct order due to foreign keys)
    await prismaTest.orderStatusHistory.deleteMany();
    await prismaTest.orderItem.deleteMany();
    await prismaTest.order.deleteMany();
    await prismaTest.cartItem.deleteMany();
    await prismaTest.menuItem.deleteMany();
    await prismaTest.category.deleteMany();

    // Seed test data with real Unsplash images
    const category = await prismaTest.category.create({
      data: {
        name: "Test Pizza",
        description: "Test category",
        imageUrl:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
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
          imageUrl:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
          isAvailable: true,
        },
        {
          categoryId: category.id,
          name: "Pepperoni Pizza",
          description: "Pizza with spicy pepperoni",
          price: 14.99,
          imageUrl:
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
          isAvailable: true,
        },
        {
          categoryId: category.id,
          name: "Unavailable Pizza",
          description: "This pizza is not available",
          price: 19.99,
          imageUrl:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
          isAvailable: false,
        },
      ],
    });

    isSeeded = true;
  }
});

// Clean up after all tests
afterAll(async () => {
  await prismaTest.$disconnect();
});
