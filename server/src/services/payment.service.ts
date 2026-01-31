import { prisma } from "../config/prisma";
import payos from "../utils/payos";
import { OrderStatus } from "@prisma/client";

export class PaymentService {
  static async verifyWebhook(webhookData: any) {
    return await payos.webhooks.verify(webhookData);
  }

  static async processPayment(
    orderId: number,
    _amount: number,
    reference: string,
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return null;
    }

    // Update order status to CONFIRMED (or PREPARING depending on business logic)
    // Only update if not already paid/confirmed to avoid duplicates
    if (order.status === OrderStatus.PENDING) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: {
          status: OrderStatus.CONFIRMED,
          statusHistory: {
            create: {
              status: OrderStatus.CONFIRMED,
              notes: `Payment confirmed via PayOS. Reference: ${reference}`,
            },
          },
        },
      });
      return { orderId, status: "confirmed" };
    } else {
      return {
        orderId,
        status: "already_processed",
        currentStatus: order.status,
      };
    }
  }
}
