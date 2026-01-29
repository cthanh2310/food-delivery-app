import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a menu item to the shopping cart or update quantity if it already exists
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - menuItemId
 *               - quantity
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Session identifier for the cart
 *                 example: session-123
 *               menuItemId:
 *                 type: integer
 *                 description: ID of the menu item to add
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantity to add (must be >= 1)
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       200:
 *         description: Item quantity updated in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid request (missing fields, invalid quantity, or menu item not available)
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
    const { sessionId, menuItemId, quantity } = req.body;

    // Validation
    if (!sessionId || !menuItemId || quantity === undefined) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: sessionId, menuItemId, quantity",
      });
      return;
    }

    if (quantity < 1) {
      res.status(400).json({
        success: false,
        error: "Quantity must be at least 1",
      });
      return;
    }

    // Verify menu item exists and is available
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      res.status(400).json({
        success: false,
        error: "Menu item not found",
      });
      return;
    }

    if (!menuItem.isAvailable) {
      res.status(400).json({
        success: false,
        error: "Menu item is not available",
      });
      return;
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

    let cartItem;
    if (existingCartItem) {
      // Update existing cart item (add to quantity)
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          menuItem: true,
        },
      });

      res.status(200).json({
        success: true,
        data: cartItem,
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          sessionId,
          menuItemId,
          quantity,
        },
        include: {
          menuItem: true,
        },
      });

      res.status(201).json({
        success: true,
        data: cartItem,
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/cart/{sessionId}:
 *   get:
 *     summary: Get cart items
 *     description: Retrieve all items in the cart for a specific session with calculated subtotal
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session identifier
 *         example: session-123
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

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

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        subtotal: Number(subtotal.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/cart/{sessionId}/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a specific item in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session identifier
 *         example: session-123
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity (must be >= 1)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid request (invalid ID or quantity)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart item not found
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
router.put("/:sessionId/:itemId", async (req: Request, res: Response) => {
  try {
    const { sessionId, itemId } = req.params;
    const { quantity } = req.body;
    const cartItemId = parseInt(itemId);

    if (isNaN(cartItemId)) {
      res.status(400).json({
        success: false,
        error: "Invalid cart item ID",
      });
      return;
    }

    if (quantity < 1) {
      res.status(400).json({
        success: false,
        error: "Quantity must be at least 1",
      });
      return;
    }

    // Verify cart item exists and belongs to session
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        sessionId,
      },
    });

    if (!existingItem) {
      res.status(404).json({
        success: false,
        error: "Cart item not found",
      });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        menuItem: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/cart/{sessionId}/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from the shopping cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session identifier
 *         example: session-123
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Item removed successfully
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
 *                   example: Item removed from cart
 *       400:
 *         description: Invalid cart item ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart item not found
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
router.delete("/:sessionId/:itemId", async (req: Request, res: Response) => {
  try {
    const { sessionId, itemId } = req.params;
    const cartItemId = parseInt(itemId);

    if (isNaN(cartItemId)) {
      res.status(400).json({
        success: false,
        error: "Invalid cart item ID",
      });
      return;
    }

    // Verify cart item exists and belongs to session
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        sessionId,
      },
    });

    if (!existingItem) {
      res.status(404).json({
        success: false,
        error: "Cart item not found",
      });
      return;
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/cart/{sessionId}:
 *   delete:
 *     summary: Clear cart
 *     description: Remove all items from the shopping cart for a specific session
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session identifier
 *         example: session-123
 *     responses:
 *       200:
 *         description: Cart cleared successfully
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
 *                   example: Cart cleared
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    await prisma.cartItem.deleteMany({
      where: { sessionId },
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
