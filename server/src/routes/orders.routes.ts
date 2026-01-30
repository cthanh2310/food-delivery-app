import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import payos from "../utils/payos";
import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
    parsePaginationParams,
    createPaginatedResponse,
} from "../utils/pagination";

const router = Router();

// Helper function to get status display text
function getStatusText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
        PENDING: "Order Received",
        CONFIRMED: "Order Confirmed",
        PREPARING: "Preparing",
        OUT_FOR_DELIVERY: "Out for Delivery",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
    };
    return statusMap[status];
}

// Helper function to get estimated time
function getEstimatedMinutes(status: OrderStatus): number | null {
    const estimateMap: Record<OrderStatus, number | null> = {
        PENDING: 30,
        CONFIRMED: 25,
        PREPARING: 20,
        OUT_FOR_DELIVERY: 15,
        DELIVERED: null,
        CANCELLED: null,
    };
    return estimateMap[status];
}

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order from the items in the shopping cart. The cart will be cleared after successful order creation.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - customerName
 *               - customerPhone
 *               - deliveryAddress
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Session identifier
 *                 example: session-123
 *               customerName:
 *                 type: string
 *                 description: Customer's full name
 *                 example: John Doe
 *               customerPhone:
 *                 type: string
 *                 description: Customer's phone number
 *                 example: 555-1234
 *               deliveryAddress:
 *                 type: string
 *                 description: Full delivery address
 *                 example: 123 Main Street, City, 12345
 *               notes:
 *                 type: string
 *                 description: Optional delivery notes
 *                 example: Please ring the doorbell
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request (missing fields or empty cart)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const {
            sessionId,
            customerName,
            customerPhone,
            deliveryAddress,
            notes,
        } = req.body;

        // Validation
        if (!sessionId || !customerName || !customerPhone || !deliveryAddress) {
            res.status(400).json({
                success: false,
                error: "Missing required fields: sessionId, customerName, customerPhone, deliveryAddress",
            });
            return;
        }

        if (!customerName.trim()) {
            res.status(400).json({
                success: false,
                error: "Customer name is required",
            });
            return;
        }

        if (!customerPhone.trim()) {
            res.status(400).json({
                success: false,
                error: "Customer phone is required",
            });
            return;
        }

        if (!deliveryAddress.trim()) {
            res.status(400).json({
                success: false,
                error: "Delivery address is required",
            });
            return;
        }

        // Get cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { sessionId },
            include: {
                menuItem: true,
            },
        });

        if (cartItems.length === 0) {
            res.status(400).json({
                success: false,
                error: "Cannot create order with empty cart",
            });
            return;
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
                        subtotal: new Decimal(
                            Number(item.menuItem.price) * item.quantity,
                        ),
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

        // Create PayOS payment link
        let checkoutUrl = "";
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
                cancelUrl: `${process.env.CORS_ORIGIN || "http://localhost:3001"}/orders/${order.uuid}`,
                returnUrl: `${process.env.CORS_ORIGIN || "http://localhost:3001"}/orders/${order.uuid}`,
            };

            const paymentLink = await payos.paymentRequests.create(paymentData);
            checkoutUrl = paymentLink.checkoutUrl;
        } catch (error) {
            console.error("Error creating payment link:", error);
        }

        res.status(201).json({
            success: true,
            data: order,
            checkoutUrl,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * @swagger
 * /api/orders/{uuid}:
 *   get:
 *     summary: Get order by UUID
 *     description: Retrieve detailed information about a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order UUID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:uuid", async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;

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

        if (!order) {
            res.status(404).json({
                success: false,
                error: "Order not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * @swagger
 * /api/orders/session/{sessionId}:
 *   get:
 *     summary: Get all orders for a session
 *     description: Retrieve a paginated list of orders associated with a specific session
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session identifier
 *         example: session-123
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/session/:sessionId", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const { page, limit, skip } = parsePaginationParams(req.query);

        // Get total count
        const total = await prisma.order.count({
            where: { sessionId },
        });

        // Get paginated orders
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
            skip,
            take: limit,
        });

        res.status(200).json(
            createPaginatedResponse(orders, page, limit, total),
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * @swagger
 * /api/orders/{uuid}/status:
 *   get:
 *     summary: Get order status
 *     description: Get the current status of an order with status history and estimated delivery time
 *     tags: [Order Status]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order UUID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Order status details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *                       example: PREPARING
 *                     statusText:
 *                       type: string
 *                       example: Preparing
 *                     estimatedMinutes:
 *                       type: integer
 *                       nullable: true
 *                       example: 20
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderStatusHistory'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:uuid/status", async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;

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

        if (!order) {
            res.status(404).json({
                success: false,
                error: "Order not found",
            });
            return;
        }

        const statusText = getStatusText(order.status);
        const estimatedMinutes = getEstimatedMinutes(order.status);

        res.status(200).json({
            success: true,
            data: {
                status: order.status,
                statusText,
                estimatedMinutes,
                history: order.statusHistory,
            },
        });
    } catch (error) {
        console.error("Error fetching order status:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * @swagger
 * /api/orders/{uuid}/status:
 *   put:
 *     summary: Update order status
 *     description: Update the status of an order (Admin endpoint). Creates a new entry in the status history.
 *     tags: [Order Status]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order UUID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *                 description: New order status
 *                 example: CONFIRMED
 *               notes:
 *                 type: string
 *                 description: Optional notes about the status change
 *                 example: Order confirmed by restaurant
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:uuid/status", async (req: Request, res: Response) => {
    try {
        const { uuid } = req.params;
        const { status, notes } = req.body;

        // Validate status
        const validStatuses: OrderStatus[] = [
            "PENDING",
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
            return;
        }

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { uuid },
        });

        if (!existingOrder) {
            res.status(404).json({
                success: false,
                error: "Order not found",
            });
            return;
        }

        // Update order status and create history entry
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

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;
