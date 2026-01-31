import { prisma } from "../config/prisma";
// import payos from "../utils/payos";
import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class OrdersService {
  static async createOrder(data: {
    sessionId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    notes?: string;
  }) {
    const { sessionId, customerName, customerPhone, deliveryAddress, notes } =
      data;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        menuItem: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error("Cannot create order with empty cart");
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = Number(item.menuItem.price);
      return total + itemPrice * item.quantity;
    }, 0);

    const deliveryFee = 5.0; // Fixed delivery fee
    const totalAmount = subtotal + deliveryFee;

    // Create order with items and initial status history
    const order = await prisma.order.create({
      data: {
        sessionId,
        status: OrderStatus.PENDING,
        subtotal: new Decimal(subtotal),
        deliveryFee: new Decimal(deliveryFee),
        totalAmount: new Decimal(totalAmount),
        customerName,
        customerPhone,
        deliveryAddress,
        notes: notes || null,
        orderItems: {
          create: cartItems.map((item) => ({
            menuItemId: item.menuItemId,
            itemName: item.menuItem.name,
            unitPrice: item.menuItem.price,
            quantity: item.quantity,
            subtotal: new Decimal(Number(item.menuItem.price) * item.quantity),
          })),
        },
        statusHistory: {
          create: {
            status: OrderStatus.PENDING,
            notes: "Order created",
          },
        },
      },
      include: {
        orderItems: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Clear cart after successful order
    await prisma.cartItem.deleteMany({
      where: { sessionId },
    });

    // Create Simulation Payment Link
    const checkoutUrl = `${process.env.CORS_ORIGIN}/payment-simulation?orderId=${order.id}&amount=${Math.round(totalAmount)}&code=${order.uuid}`;

    // PayOS logic removed for simulation
    /*
    try {
      const paymentData = {
        orderCode: order.id,
        // Fixed amount for testing with VND currency
        amount: 4000, // PayOS requires integer
        // amount: Math.round(totalAmount), // PayOS requires integer
        description: `Order #${order.id}`,
        items: cartItems.map((item) => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          price: Number(item.menuItem.price),
        })),
        cancelUrl: `${process.env.CORS_ORIGIN}/orders/${order.uuid}`,
        returnUrl: `${process.env.CORS_ORIGIN}/orders/${order.uuid}`,
      };

      const paymentLink = await payos.paymentRequests.create(paymentData);
      checkoutUrl = paymentLink.checkoutUrl;
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
    */

    return { order, checkoutUrl };
  }

  static async getOrderByUuid(uuid: string) {
    const order = await prisma.order.findUnique({
      where: { uuid },
      include: {
        orderItems: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return order;
  }

  static async getOrdersBySession(
    sessionId: string,
    pagination: { skip: number; limit: number },
  ) {
    const total = await prisma.order.count({
      where: { sessionId },
    });

    const orders = await prisma.order.findMany({
      where: { sessionId },
      include: {
        orderItems: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: pagination.skip,
      take: pagination.limit,
    });

    return { orders, total };
  }

  static async getOrderStatus(uuid: string) {
    const order = await prisma.order.findUnique({
      where: { uuid },
      select: {
        status: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return order;
  }

  static async updateOrderStatus(
    uuid: string,
    status: OrderStatus,
    notes?: string,
  ) {
    const existingOrder = await prisma.order.findUnique({
      where: { uuid },
    });

    if (!existingOrder) {
      return null;
    }

    const order = await prisma.order.update({
      where: { uuid },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            notes: notes || null,
          },
        },
      },
      include: {
        orderItems: true,
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return order;
  }

  static async updateOrderStatusById(
    id: number,
    status: OrderStatus,
    notes?: string,
  ) {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return null;
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            notes: notes || null,
          },
        },
      },
    });

    return order;
  }
}
