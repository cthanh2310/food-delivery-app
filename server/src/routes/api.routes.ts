import { Router, Request, Response } from "express";
import menuRoutes from "./menu.routes";
import cartRoutes from "./cart.routes";
import ordersRoutes from "./orders.routes";
import categoriesRoutes from "./categories.routes";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: API is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 error:
 *                   type: string
 */
router.get("/health", async (_req: Request, res: Response) => {
  try {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Mount route modules
router.use("/menu", menuRoutes);
router.use("/categories", categoriesRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", ordersRoutes);

export default router;
