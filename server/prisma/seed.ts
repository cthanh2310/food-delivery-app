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

  // Create categories with high-quality Unsplash images
  const pizzaCategory = await prisma.category.create({
    data: {
      name: "Pizza",
      description: "Delicious handcrafted pizzas with fresh ingredients",
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      sortOrder: 1,
      isActive: true,
    },
  });

  const burgersCategory = await prisma.category.create({
    data: {
      name: "Burgers",
      description: "Juicy burgers made with premium beef",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
      sortOrder: 2,
      isActive: true,
    },
  });

  const pastaCategory = await prisma.category.create({
    data: {
      name: "Pasta",
      description: "Authentic Italian pasta dishes",
      imageUrl:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
      sortOrder: 3,
      isActive: true,
    },
  });

  const saladCategory = await prisma.category.create({
    data: {
      name: "Salads",
      description: "Fresh and healthy salad options",
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      sortOrder: 4,
      isActive: true,
    },
  });

  const drinksCategory = await prisma.category.create({
    data: {
      name: "Drinks",
      description: "Refreshing beverages to complement your meal",
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
      sortOrder: 5,
      isActive: true,
    },
  });

  const dessertsCategory = await prisma.category.create({
    data: {
      name: "Desserts",
      description: "Sweet treats to end your meal perfectly",
      imageUrl:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
      sortOrder: 6,
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
        description:
          "Classic Italian pizza with fresh tomatoes, mozzarella, and basil",
        price: 12.99,
        imageUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: pizzaCategory.id,
        name: "Pepperoni Pizza",
        description: "Loaded with spicy pepperoni and melted mozzarella cheese",
        price: 14.99,
        imageUrl:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        categoryId: pizzaCategory.id,
        name: "Quattro Formaggi",
        description:
          "Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina",
        price: 15.99,
        imageUrl:
          "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80",
        isAvailable: true,
        sortOrder: 3,
      },
      {
        categoryId: pizzaCategory.id,
        name: "Hawaiian Pizza",
        description: "Tropical delight with ham, pineapple, and mozzarella",
        price: 13.99,
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        isAvailable: true,
        sortOrder: 4,
      },
      {
        categoryId: pizzaCategory.id,
        name: "Veggie Supreme",
        description:
          "Loaded with bell peppers, mushrooms, olives, onions, and tomatoes",
        price: 13.49,
        imageUrl:
          "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=800&q=80",
        isAvailable: true,
        sortOrder: 5,
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
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
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
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        categoryId: burgersCategory.id,
        name: "Mushroom Swiss Burger",
        description:
          "Juicy beef patty topped with sautéed mushrooms and Swiss cheese",
        price: 11.99,
        imageUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        isAvailable: true,
        sortOrder: 3,
      },
      {
        categoryId: burgersCategory.id,
        name: "Chicken Burger",
        description: "Crispy chicken breast with lettuce, tomato, and mayo",
        price: 10.49,
        imageUrl:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
        isAvailable: true,
        sortOrder: 4,
      },
    ],
  });

  // Create menu items - Pasta
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: pastaCategory.id,
        name: "Spaghetti Carbonara",
        description:
          "Classic Roman pasta with eggs, pecorino cheese, and crispy bacon",
        price: 14.99,
        imageUrl:
          "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: pastaCategory.id,
        name: "Fettuccine Alfredo",
        description: "Creamy parmesan sauce with fettuccine pasta",
        price: 13.99,
        imageUrl:
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        categoryId: pastaCategory.id,
        name: "Penne Arrabbiata",
        description: "Spicy tomato sauce with garlic and red chili peppers",
        price: 12.49,
        imageUrl:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
        isAvailable: true,
        sortOrder: 3,
      },
      {
        categoryId: pastaCategory.id,
        name: "Lasagna Bolognese",
        description: "Layers of pasta with rich meat sauce and béchamel",
        price: 15.99,
        imageUrl:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
        isAvailable: true,
        sortOrder: 4,
      },
    ],
  });

  // Create menu items - Salads
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: saladCategory.id,
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing",
        price: 8.99,
        imageUrl:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: saladCategory.id,
        name: "Greek Salad",
        description:
          "Fresh tomatoes, cucumbers, olives, feta cheese, and olive oil",
        price: 9.49,
        imageUrl:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        categoryId: saladCategory.id,
        name: "Caprese Salad",
        description:
          "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
        price: 10.99,
        imageUrl:
          "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
        isAvailable: true,
        sortOrder: 3,
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
          "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: drinksCategory.id,
        name: "Fresh Lemonade",
        description: "Homemade lemonade with fresh lemons and mint",
        price: 3.99,
        imageUrl:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        categoryId: drinksCategory.id,
        name: "Iced Coffee",
        description: "Cold brew coffee served over ice",
        price: 4.49,
        imageUrl:
          "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80",
        isAvailable: true,
        sortOrder: 3,
      },
      {
        categoryId: drinksCategory.id,
        name: "Orange Juice",
        description: "Freshly squeezed orange juice (250ml)",
        price: 3.49,
        imageUrl:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        isAvailable: true,
        sortOrder: 4,
      },
    ],
  });

  // Create menu items - Desserts
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: dessertsCategory.id,
        name: "Tiramisu",
        description:
          "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
        price: 6.99,
        imageUrl:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        categoryId: dessertsCategory.id,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten chocolate center",
        price: 7.49,
        imageUrl:
          "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        categoryId: dessertsCategory.id,
        name: "New York Cheesecake",
        description: "Creamy cheesecake with graham cracker crust",
        price: 6.49,
        imageUrl:
          "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
        isAvailable: true,
        sortOrder: 3,
      },
      {
        categoryId: dessertsCategory.id,
        name: "Ice Cream Sundae",
        description:
          "Three scoops of vanilla ice cream with chocolate sauce and whipped cream",
        price: 5.99,
        imageUrl:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
        isAvailable: true,
        sortOrder: 4,
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
