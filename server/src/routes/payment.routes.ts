import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

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
 *                 message:
 *                   type: string
 *                   example: Webhook processed
 */
router.post("/webhook", PaymentController.handleWebhook);

export default router;
