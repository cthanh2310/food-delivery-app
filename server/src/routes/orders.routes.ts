import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";

const router = Router();

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
router.post("/", OrdersController.createOrder);

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
router.get("/:uuid", OrdersController.getOrderByUuid);

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
router.get("/session/:sessionId", OrdersController.getOrdersBySession);

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
router.get("/:uuid/status", OrdersController.getOrderStatus);

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
router.put("/:uuid/status", OrdersController.updateOrderStatus);

export default router;
