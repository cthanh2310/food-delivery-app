import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: config.cors.origin,
        credentials: true,
    }),
);

// Logging middleware
if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
