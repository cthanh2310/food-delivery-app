import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all active categories
 *     description: Retrieve a list of all active food categories with menu item counts
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of active categories
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
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", CategoriesController.getCategories);

export default router;
