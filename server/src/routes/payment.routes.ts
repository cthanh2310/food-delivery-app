import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import payos from "../utils/payos";
import { OrderStatus } from "@prisma/client";

const router = Router();

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Handle PayOS payment webhook
 *     description: Receive and verify payment notifications from PayOS
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               desc:
 *                 type: string
 *               success:
 *                 type: boolean
 *               data:
 *                 type: object
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.post("/webhook", async (req: Request, res: Response) => {
    try {
        console.log("Received PayOS webhook:", JSON.stringify(req.body));

        // Verify webhook data
        const webhookData = await payos.webhooks.verify(req.body);

        // If validation succeeds, process the order
        const orderId = webhookData.orderCode;
        const amount = webhookData.amount;

        console.log(
            `Processing payment for Order #${orderId}, Amount: ${amount}`,
        );

        // Find the order
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
        });

        if (!order) {
            console.error(`Order #${orderId} not found`);
            res.json({ success: false, message: "Order not found" });
            return;
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
                            notes: `Payment confirmed via PayOS. Reference: ${webhookData.reference}`,
                        },
                    },
                },
            });
            console.log(`Order #${orderId} confirmed`);
        } else {
            console.log(
                `Order #${orderId} already processed (Status: ${order.status})`,
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
});

export default router;
