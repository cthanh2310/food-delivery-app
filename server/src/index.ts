import app from "./app";
import { config } from "./config";
import { db } from "./config/database";

const PORT = config.port;

// Initialize database connection
const startServer = async () => {
    try {
        // Test database connection
        const isConnected = await db.testConnection();
        if (!isConnected) {
            console.error("❌ Failed to connect to database. Exiting...");
            process.exit(1);
        }

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📝 Environment: ${config.nodeEnv}`);
            console.log(`🔗 API URL: http://localhost:${PORT}/api`);
            console.log(
                `💾 Database: ${config.database.name} on ${config.database.host}:${config.database.port}`,
            );
        });

        // Graceful shutdown
        const shutdown = async (signal: string) => {
            console.log(`👋 ${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                console.log("🔌 HTTP server closed");
                try {
                    await db.close();
                    console.log("💥 Process terminated!");
                    process.exit(0);
                } catch (error) {
                    console.error("❌ Error during shutdown:", error);
                    process.exit(1);
                }
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error("⚠️ Forcing shutdown after timeout");
                process.exit(1);
            }, 10000);
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Start the server
startServer();
