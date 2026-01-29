import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
  parsePaginationParams,
  createPaginatedResponse,
} from "../utils/pagination";

const router = Router();

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all available menu items
 *     description: Retrieve a paginated list of all available menu items with their category information
 *     tags: [Menu]
 *     parameters:
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
 *         description: Paginated list of available menu items
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
 *                     $ref: '#/components/schemas/MenuItem'
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
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = parsePaginationParams(req.query);

    // Get total count for pagination
    const total = await prisma.menuItem.count({
      where: {
        isAvailable: true,
      },
    });

    // Get paginated menu items
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      skip,
      take: limit,
    });

    res
      .status(200)
      .json(createPaginatedResponse(menuItems, page, limit, total));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     description: Retrieve detailed information about a specific menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Invalid menu item ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Menu item not found
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
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuItemId = parseInt(id);

    if (isNaN(menuItemId)) {
      res.status(400).json({
        success: false,
        error: "Invalid menu item ID",
      });
      return;
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!menuItem) {
      res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
