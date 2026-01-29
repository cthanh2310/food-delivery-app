import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",

    database: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        name: process.env.DB_NAME || "food_delivery",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        poolMin: parseInt(process.env.DB_POOL_MIN || "2", 10),
        poolMax: parseInt(process.env.DB_POOL_MAX || "10", 10),
    },

    jwt: {
        secret: process.env.JWT_SECRET || "your-secret-key",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },

    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    },
};
