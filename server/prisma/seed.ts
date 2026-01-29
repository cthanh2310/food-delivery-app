import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log("📦 Creating categories...");

  // Create categories
  const pizzaCategory = await prisma.category.create({
    data: {
      name: "Pizza",
      description: "Delicious handcrafted pizzas with fresh ingredients",
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      sortOrder: 1,
      isActive: true,
    },
  });

  const burgersCategory = await prisma.category.create({
    data: {
      name: "Burgers",
      description: "Juicy burgers made with premium beef",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      sortOrder: 2,
      isActive: true,
    },
  });

  const drinksCategory = await prisma.category.create({
    data: {
      name: "Drinks",
      description: "Refreshing beverages to complement your meal",
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
      sortOrder: 3,
      isActive: true,
    },
  });

  console.log("🍕 Creating menu items...");

  // Create menu items - Pizzas
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: pizzaCategory.id,
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
        price: 12.99,
        imageUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: pizzaCategory.id,
        name: "Pepperoni Pizza",
        description: "Loaded with spicy pepperoni and melted mozzarella cheese",
        price: 14.99,
        imageUrl:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        isAvailable: true,
        sortOrder: 2,
      },
    ],
  });

  // Create menu items - Burgers
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: burgersCategory.id,
        name: "Classic Cheeseburger",
        description:
          "Beef patty with cheddar cheese, lettuce, tomato, and special sauce",
        price: 9.99,
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: burgersCategory.id,
        name: "Bacon Deluxe Burger",
        description:
          "Double patty with crispy bacon, cheese, and caramelized onions",
        price: 13.99,
        imageUrl:
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
        isAvailable: true,
        sortOrder: 2,
      },
    ],
  });

  // Create menu items - Drinks
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: drinksCategory.id,
        name: "Coca-Cola",
        description: "Classic refreshing cola drink (330ml)",
        price: 2.49,
        imageUrl:
          "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: drinksCategory.id,
        name: "Fresh Lemonade",
        description: "Homemade lemonade with fresh lemons and mint",
        price: 3.99,
        imageUrl:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400",
        isAvailable: true,
        sortOrder: 2,
      },
    ],
  });

  // Get final counts
  const categoriesCount = await prisma.category.count();
  const menuItemsCount = await prisma.menuItem.count();

  console.log(`✅ Seed completed!`);
  console.log(`   - ${categoriesCount} categories created`);
  console.log(`   - ${menuItemsCount} menu items created`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
