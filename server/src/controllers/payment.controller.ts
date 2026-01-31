import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { OrdersService } from "../services/orders.service";
import { OrderStatus } from "@prisma/client";

export class PaymentController {
  static async simulatePayment(req: Request, res: Response) {
    try {
      const { orderId, success, note } = req.body;

      if (!orderId) {
        res.status(400).json({ success: false, message: "Missing orderId" });
        return;
      }

      if (success) {
        const result = await PaymentService.processPayment(
          Number(orderId),
          0,
          "SIMULATION",
        );

        if (!result) {
          res.status(404).json({ success: false, message: "Order not found" });
          return;
        }

        res.json({ success: true, message: "Payment simulated successfully" });
      } else {
        // Handle failed payment/cancellation
        await OrdersService.updateOrderStatusById(
          Number(orderId),
          OrderStatus.CANCELLED,
          note || "User cancelled payment simulation",
        );
        res.json({
          success: true,
          message: "Order cancelled",
        });
      }
    } catch (error) {
      console.error("Error simulating payment:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  static async handleWebhook(req: Request, res: Response) {
    try {
      console.log("Received PayOS webhook:", JSON.stringify(req.body));

      // Verify webhook data
      const webhookData = await PaymentService.verifyWebhook(req.body);

      // If validation succeeds, process the order
      const orderId = webhookData.orderCode;
      const amount = webhookData.amount;
      const reference = webhookData.reference;

      console.log(
        `Processing payment for Order #${orderId}, Amount: ${amount}`,
      );

      const result = await PaymentService.processPayment(
        orderId,
        amount,
        reference,
      );

      if (!result) {
        console.error(`Order #${orderId} not found`);
        res.json({ success: false, message: "Order not found" });
        return;
      }

      if (result.status === "confirmed") {
        console.log(`Order #${orderId} confirmed`);
      } else {
        console.log(
          `Order #${orderId} already processed (Status: ${result.currentStatus})`,
        );
      }

      res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
