import { Router, Request, Response } from "express";
import { db } from "../config/database";

const router = Router();

/**
 * GET /api/health
 * Health check endpoint with database status
 */
router.get("/health", async (_req: Request, res: Response) => {
    try {
        const dbStatus = await db.testConnection();
        res.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            database: dbStatus ? "connected" : "disconnected",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            timestamp: new Date().toISOString(),
            database: "error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * GET /api/users
 * Example endpoint to fetch users from database
 */
router.get("/users", async (_req: Request, res: Response) => {
    try {
        const result = await db.query<{
            id: number;
            uuid: string;
            email: string;
            first_name: string;
            last_name: string;
            role: string;
        }>("SELECT id, uuid, email, first_name, last_name, role FROM users");

        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * GET /api/users/:id
 * Example endpoint to fetch a single user by ID
 */
router.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.query<{
            id: number;
            uuid: string;
            email: string;
            first_name: string;
            last_name: string;
            phone: string;
            role: string;
        }>(
            "SELECT id, uuid, email, first_name, last_name, phone, role FROM users WHERE id = $1",
            [id],
        );

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }

        res.json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;
