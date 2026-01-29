import { Router } from "express";
import apiRoutes from "./api.routes";

const router = Router();

// Mount API routes
router.use("/", apiRoutes);

// API info endpoint
router.get("/", (_req, res) => {
    res.status(200).json({
        status: "success",
        message: "Food Delivery API",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            users: "/api/users",
            userById: "/api/users/:id",
        },
    });
});

export default router;
