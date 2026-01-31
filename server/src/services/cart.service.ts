import { prisma } from "../config/prisma";

export class CartService {
  static async addToCart(data: {
    sessionId: string;
    menuItemId: number;
    quantity: number;
  }) {
    const { sessionId, menuItemId, quantity } = data;

    // Verify menu item exists and is available
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (!menuItem.isAvailable) {
      throw new Error("Menu item is not available");
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        sessionId_menuItemId: {
          sessionId,
          menuItemId,
        },
      },
    });

    if (existingCartItem) {
      // Update existing cart item (add to quantity)
      const item = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          menuItem: true,
        },
      });
      return { item, isNew: false };
    } else {
      // Create new cart item
      const item = await prisma.cartItem.create({
        data: {
          sessionId,
          menuItemId,
          quantity,
        },
        include: {
          menuItem: true,
        },
      });
      return { item, isNew: true };
    }
  }

  static async getCart(sessionId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            isAvailable: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = Number(item.menuItem.price);
      return total + itemPrice * item.quantity;
    }, 0);

    return {
      items: cartItems,
      subtotal: Number(subtotal.toFixed(2)),
    };
  }

  static async updateCartItemDuration(
    sessionId: string,
    itemId: string,
    quantity: number,
  ) {
    const cartItemId = parseInt(itemId);

    if (isNaN(cartItemId)) {
      throw new Error("Invalid cart item ID");
    }

    // Verify cart item exists and belongs to session
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        sessionId,
      },
    });

    if (!existingItem) {
      throw new Error("Cart item not found");
    }

    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        menuItem: true,
      },
    });
  }

  static async removeFromCart(sessionId: string, itemId: string) {
    const cartItemId = parseInt(itemId);

    if (isNaN(cartItemId)) {
      throw new Error("Invalid cart item ID");
    }

    // Verify cart item exists and belongs to session
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        sessionId,
      },
    });

    if (!existingItem) {
      throw new Error("Cart item not found");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  static async clearCart(sessionId: string) {
    await prisma.cartItem.deleteMany({
      where: { sessionId },
    });
  }
}
